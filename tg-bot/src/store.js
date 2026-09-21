const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const PAYMENTS_FILE = path.join(DATA_DIR, 'payments.json');

function readJson(file) {
  if (!fs.existsSync(file)) return {};
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, data) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function getUser(telegramUserId) {
  const users = readJson(USERS_FILE);
  return users[telegramUserId] || null;
}

function grantAccess(telegramUserId, days) {
  const users = readJson(USERS_FILE);
  const now = Date.now();
  const current = users[telegramUserId];
  const base = current && current.accessUntil > now ? current.accessUntil : now;
  users[telegramUserId] = { accessUntil: base + days * 24 * 60 * 60 * 1000 };
  writeJson(USERS_FILE, users);
  return users[telegramUserId];
}

function savePendingPayment(paymentId, info) {
  const payments = readJson(PAYMENTS_FILE);
  payments[paymentId] = { ...info, status: 'pending', createdAt: Date.now() };
  writeJson(PAYMENTS_FILE, payments);
}

function getPendingPayments() {
  const payments = readJson(PAYMENTS_FILE);
  return Object.entries(payments).filter(([, p]) => p.status === 'pending');
}

function markPaymentStatus(paymentId, status) {
  const payments = readJson(PAYMENTS_FILE);
  if (payments[paymentId]) {
    payments[paymentId].status = status;
    writeJson(PAYMENTS_FILE, payments);
  }
}

function getPayment(paymentId) {
  const payments = readJson(PAYMENTS_FILE);
  return payments[paymentId] || null;
}

module.exports = {
  getUser,
  grantAccess,
  savePendingPayment,
  getPendingPayments,
  markPaymentStatus,
  getPayment,
};
