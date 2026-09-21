require('dotenv').config();

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Не задана переменная окружения ${name}. Скопируйте .env.example в .env и заполните её.`);
  }
  return value;
}

// Тарифы: сумма в рублях -> сколько дней доступа он даёт.
// Значения ориентировочные, поменяйте под свою задачу.
const PLANS = [
  { amount: 5, days: 1, label: '5 ₽ — пробный доступ на 1 день' },
  { amount: 50, days: 30, label: '50 ₽ — подписка на 30 дней' },
  { amount: 100, days: 90, label: '100 ₽ — подписка на 90 дней' },
];

module.exports = {
  botToken: required('BOT_TOKEN'),
  yookassaShopId: required('YOOKASSA_SHOP_ID'),
  yookassaSecretKey: required('YOOKASSA_SECRET_KEY'),
  pollIntervalMs: Number(process.env.POLL_INTERVAL_MS || 15000),
  plans: PLANS,
};
