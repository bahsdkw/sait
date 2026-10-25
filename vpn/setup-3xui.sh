#!/usr/bin/env bash
# Installs and configures the 3x-ui panel with a VLESS + Reality inbound.
# Runs on the target server as root. Expects env: PANEL_PASSWORD, PANEL_PATH,
# optional: PANEL_USER (admin), PANEL_PORT (2053), VPN_PORT (443),
# REALITY_SNI (www.microsoft.com), CLIENTS (3).
# Never prints secrets: the repository and its Actions logs are public.
set -euo pipefail

PANEL_USER="${PANEL_USER:-admin}"
PANEL_PORT="${PANEL_PORT:-2053}"
VPN_PORT="${VPN_PORT:-443}"
REALITY_SNI="${REALITY_SNI:-www.microsoft.com}"
CLIENTS="${CLIENTS:-3}"
PANEL_PATH="${PANEL_PATH#/}"; PANEL_PATH="${PANEL_PATH%/}"
: "${PANEL_PASSWORD:?PANEL_PASSWORD is required}"
: "${PANEL_PATH:?PANEL_PATH is required}"

log() { echo "==> $*"; }

[ "$(id -u)" = 0 ] || { echo "must run as root"; exit 1; }

log "System: $(. /etc/os-release && echo "$PRETTY_NAME"), arch $(uname -m)"

# --- packages ---------------------------------------------------------------
if command -v apt-get >/dev/null; then
  export DEBIAN_FRONTEND=noninteractive
  apt-get update -qq
  apt-get install -y -qq curl tar jq openssl ufw fail2ban ca-certificates >/dev/null
elif command -v dnf >/dev/null; then
  dnf install -y -q curl tar jq openssl firewalld fail2ban ca-certificates
else
  echo "unsupported OS"; exit 1
fi

# --- BBR --------------------------------------------------------------------
if ! sysctl -n net.ipv4.tcp_congestion_control | grep -q bbr; then
  log "Enabling BBR"
  printf 'net.core.default_qdisc=fq\nnet.ipv4.tcp_congestion_control=bbr\n' > /etc/sysctl.d/99-bbr.conf
  sysctl --system >/dev/null || true
fi

# --- 3x-ui ------------------------------------------------------------------
case "$(uname -m)" in
  x86_64|amd64) ARCH=amd64 ;;
  aarch64|arm64) ARCH=arm64 ;;
  *) echo "unsupported arch $(uname -m)"; exit 1 ;;
esac

if [ ! -x /usr/local/x-ui/x-ui ]; then
  log "Downloading 3x-ui (latest release)"
  tmp="$(mktemp -d)"
  curl -fsSL -o "$tmp/x-ui.tar.gz" \
    "https://github.com/MHSanaei/3x-ui/releases/latest/download/x-ui-linux-${ARCH}.tar.gz"
  tar -xzf "$tmp/x-ui.tar.gz" -C "$tmp"
  rm -rf /usr/local/x-ui
  mv "$tmp/x-ui" /usr/local/x-ui
  chmod +x /usr/local/x-ui/x-ui /usr/local/x-ui/bin/xray-linux-* 2>/dev/null || true
  [ -f /usr/local/x-ui/x-ui.sh ] && install -m 755 /usr/local/x-ui/x-ui.sh /usr/bin/x-ui
  rm -rf "$tmp"
else
  log "3x-ui already installed, reconfiguring"
fi

cat > /etc/systemd/system/x-ui.service <<'EOF'
[Unit]
Description=x-ui Service
After=network.target
Wants=network.target

[Service]
Environment="XRAY_VMESS_AEAD_FORCED=false"
Type=simple
WorkingDirectory=/usr/local/x-ui/
ExecStart=/usr/local/x-ui/x-ui
Restart=on-failure
RestartSec=5s

[Install]
WantedBy=multi-user.target
EOF

/usr/local/x-ui/x-ui migrate >/dev/null 2>&1 || true
/usr/local/x-ui/x-ui setting -username "$PANEL_USER" -password "$PANEL_PASSWORD" \
  -port "$PANEL_PORT" -webBasePath "$PANEL_PATH" >/dev/null
systemctl daemon-reload
systemctl enable x-ui >/dev/null 2>&1
systemctl restart x-ui

BASE="http://127.0.0.1:${PANEL_PORT}/${PANEL_PATH}"
log "Waiting for panel"
for _ in $(seq 1 30); do
  curl -s -o /dev/null "$BASE/" && break
  sleep 2
done

JAR="$(mktemp)"
trap 'rm -f "$JAR"' EXIT
login_ok="$(curl -s -c "$JAR" -X POST "$BASE/login" \
  --data-urlencode "username=$PANEL_USER" --data-urlencode "password=$PANEL_PASSWORD" | jq -r '.success')"
[ "$login_ok" = "true" ] || { echo "panel login failed"; journalctl -u x-ui -n 30 --no-pager; exit 1; }
log "Panel login OK"

# --- VLESS Reality inbound ---------------------------------------------------
existing="$(curl -s -b "$JAR" -X POST "$BASE/panel/api/inbounds/list" \
  | jq --argjson p "$VPN_PORT" '[.obj[]? | select(.port == $p)] | length')"
if [ "${existing:-0}" -gt 0 ]; then
  log "Inbound on port $VPN_PORT already exists, skipping creation"
else
  XRAY="$(ls /usr/local/x-ui/bin/xray-linux-* | head -n1)"
  keys="$("$XRAY" x25519)"
  PRIV="$(echo "$keys" | awk -F': *' '/^Private ?[Kk]ey/ {print $2}')"
  PUB="$(echo "$keys" | awk -F': *' '/^(Public key|PublicKey|Password)/ {print $2; exit}')"
  [ -n "$PRIV" ] && [ -n "$PUB" ] || { echo "failed to parse x25519 keys"; exit 1; }
  SID="$(openssl rand -hex 8)"

  clients='[]'
  for i in $(seq 1 "$CLIENTS"); do
    clients="$(jq -c --arg id "$(cat /proc/sys/kernel/random/uuid)" --arg email "user$i" \
      --arg sub "$(openssl rand -hex 8)" \
      '. + [{id:$id, flow:"xtls-rprx-vision", email:$email, limitIp:0, totalGB:0,
             expiryTime:0, enable:true, tgId:"", subId:$sub, reset:0}]' <<<"$clients")"
  done

  settings="$(jq -c -n --argjson c "$clients" '{clients:$c, decryption:"none", fallbacks:[]}')"
  stream="$(jq -c -n --arg sni "$REALITY_SNI" --arg priv "$PRIV" --arg pub "$PUB" --arg sid "$SID" '{
    network:"tcp", security:"reality", externalProxy:[],
    realitySettings:{show:false, xver:0, dest:($sni+":443"), target:($sni+":443"),
      serverNames:[$sni], privateKey:$priv, minClient:"", maxClient:"", maxTimediff:0,
      shortIds:[$sid], settings:{publicKey:$pub, fingerprint:"chrome", serverName:"", spiderX:"/"}},
    tcpSettings:{acceptProxyProtocol:false, header:{type:"none"}}}')"
  sniffing='{"enabled":true,"destOverride":["http","tls","quic","fakedns"],"metadataOnly":false,"routeOnly":false}'

  add_ok="$(curl -s -b "$JAR" -X POST "$BASE/panel/api/inbounds/add" \
    --data-urlencode "up=0" --data-urlencode "down=0" --data-urlencode "total=0" \
    --data-urlencode "remark=VLESS-Reality" --data-urlencode "enable=true" \
    --data-urlencode "expiryTime=0" --data-urlencode "listen=" \
    --data-urlencode "port=$VPN_PORT" --data-urlencode "protocol=vless" \
    --data-urlencode "settings=$settings" --data-urlencode "streamSettings=$stream" \
    --data-urlencode "sniffing=$sniffing")"
  [ "$(jq -r '.success' <<<"$add_ok")" = "true" ] || { echo "inbound creation failed: $(jq -r '.msg' <<<"$add_ok")"; exit 1; }
  log "Created VLESS Reality inbound on port $VPN_PORT with $CLIENTS clients"

  # Client links are kept on the server only (root-readable), never in logs.
  IP="$(curl -4 -fsS https://api.ipify.org || hostname -I | awk '{print $1}')"
  umask 077
  jq -r --arg ip "$IP" --arg port "$VPN_PORT" --arg pub "$PUB" --arg sid "$SID" --arg sni "$REALITY_SNI" \
    '.[] | "vless://\(.id)@\($ip):\($port)?type=tcp&security=reality&pbk=\($pub)&fp=chrome&sni=\($sni)&sid=\($sid)&spx=%2F&flow=xtls-rprx-vision#\(.email)"' \
    <<<"$clients" > /root/vpn-clients.txt
  log "Client links saved to /root/vpn-clients.txt"
fi

# --- firewall -----------------------------------------------------------------
SSH_PORTS="$(ss -tlnpH 2>/dev/null | awk '/sshd/ {n=split($4,a,":"); print a[n]}' | sort -u)"
[ -n "$SSH_PORTS" ] || SSH_PORTS=22
if command -v ufw >/dev/null; then
  for p in $SSH_PORTS; do ufw allow "$p/tcp" >/dev/null; done
  ufw allow "$VPN_PORT/tcp" >/dev/null
  ufw allow "$PANEL_PORT/tcp" >/dev/null
  ufw --force enable >/dev/null
  log "ufw: allowed ssh ($SSH_PORTS), $VPN_PORT, $PANEL_PORT"
elif command -v firewall-cmd >/dev/null; then
  systemctl enable --now firewalld >/dev/null 2>&1
  for p in $SSH_PORTS "$VPN_PORT" "$PANEL_PORT"; do firewall-cmd -q --permanent --add-port="$p/tcp"; done
  firewall-cmd -q --reload
  log "firewalld: allowed ssh ($SSH_PORTS), $VPN_PORT, $PANEL_PORT"
fi
systemctl enable --now fail2ban >/dev/null 2>&1 || true

# --- checks -------------------------------------------------------------------
sleep 3
systemctl is-active --quiet x-ui && log "x-ui service: active" || { echo "x-ui not active"; exit 1; }
ss -tlnH | awk '{print $4}' | grep -qE ":${VPN_PORT}$" && log "Port $VPN_PORT: listening" \
  || { echo "port $VPN_PORT not listening"; journalctl -u x-ui -n 30 --no-pager; exit 1; }
log "DONE. Panel: http://<server-ip>:${PANEL_PORT}/<PANEL_PATH>/  login: ${PANEL_USER}"
