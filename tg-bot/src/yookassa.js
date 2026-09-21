const axios = require('axios');
const crypto = require('crypto');
const { yookassaShopId, yookassaSecretKey } = require('./config');

const client = axios.create({
  baseURL: 'https://api.yookassa.ru/v3',
  auth: { username: yookassaShopId, password: yookassaSecretKey },
});

async function createPayment({ amount, description, telegramUserId }) {
  const idempotenceKey = crypto.randomUUID();
  const { data } = await client.post(
    '/payments',
    {
      amount: { value: amount.toFixed(2), currency: 'RUB' },
      capture: true,
      confirmation: { type: 'redirect', return_url: 'https://t.me' },
      description,
      metadata: { telegramUserId: String(telegramUserId) },
    },
    { headers: { 'Idempotence-Key': idempotenceKey } }
  );
  return data;
}

async function getPayment(paymentId) {
  const { data } = await client.get(`/payments/${paymentId}`);
  return data;
}

module.exports = { createPayment, getPayment };
