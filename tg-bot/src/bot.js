const { Telegraf, Markup } = require('telegraf');
const config = require('./config');
const yookassa = require('./yookassa');
const store = require('./store');

const bot = new Telegraf(config.botToken);

function formatDate(ts) {
  return new Date(ts).toLocaleString('ru-RU');
}

function planKeyboard() {
  return Markup.inlineKeyboard(
    config.plans.map((plan) => [Markup.button.callback(plan.label, `buy:${plan.amount}`)])
  );
}

bot.start((ctx) => {
  ctx.reply(
    'Привет! Здесь можно оформить платный доступ.\n\nВыберите тариф:',
    planKeyboard()
  );
});

bot.command('status', (ctx) => {
  const user = store.getUser(String(ctx.from.id));
  if (user && user.accessUntil > Date.now()) {
    ctx.reply(`Доступ активен до ${formatDate(user.accessUntil)}.`);
  } else {
    ctx.reply('Активного доступа нет. Используйте /start, чтобы оформить.');
  }
});

bot.action(/buy:(\d+)/, async (ctx) => {
  const amount = Number(ctx.match[1]);
  const plan = config.plans.find((p) => p.amount === amount);
  if (!plan) return ctx.answerCbQuery('Такого тарифа нет');

  await ctx.answerCbQuery();

  try {
    const payment = await yookassa.createPayment({
      amount: plan.amount,
      description: plan.label,
      telegramUserId: ctx.from.id,
    });

    store.savePendingPayment(payment.id, {
      telegramUserId: String(ctx.from.id),
      amount: plan.amount,
      days: plan.days,
    });

    await ctx.reply(
      `Тариф: ${plan.label}\nСумма: ${plan.amount} ₽\n\nОплатите по ссылке, затем нажмите «Я оплатил».`,
      Markup.inlineKeyboard([
        [Markup.button.url('Оплатить', payment.confirmation.confirmation_url)],
        [Markup.button.callback('Я оплатил ✅', `check:${payment.id}`)],
      ])
    );
  } catch (err) {
    console.error('Ошибка создания платежа:', err.response?.data || err.message);
    await ctx.reply('Не удалось создать платёж. Попробуйте позже.');
  }
});

async function finalizeIfPaid(paymentId) {
  const payment = await yookassa.getPayment(paymentId);
  if (payment.status !== 'succeeded') return payment;

  const pending = store.getPayment(paymentId);
  if (pending && pending.status === 'pending') {
    store.markPaymentStatus(paymentId, 'succeeded');
    const user = store.grantAccess(pending.telegramUserId, pending.days);
    await bot.telegram.sendMessage(
      pending.telegramUserId,
      `Оплата получена ✅\nДоступ активен до ${formatDate(user.accessUntil)}.`
    );
  }
  return payment;
}

bot.action(/check:(.+)/, async (ctx) => {
  const paymentId = ctx.match[1];
  await ctx.answerCbQuery('Проверяю...');
  try {
    const payment = await finalizeIfPaid(paymentId);
    if (payment.status === 'pending' || payment.status === 'waiting_for_capture') {
      await ctx.reply('Платёж ещё не завершён. Попробуйте ещё раз через минуту после оплаты.');
    } else if (payment.status === 'canceled') {
      await ctx.reply('Платёж отменён.');
    }
    // при status === 'succeeded' сообщение об успехе уже отправлено в finalizeIfPaid
  } catch (err) {
    console.error('Ошибка проверки платежа:', err.response?.data || err.message);
    await ctx.reply('Не удалось проверить платёж. Попробуйте позже.');
  }
});

// Фоновая проверка на случай, если пользователь не нажал "Я оплатил"
setInterval(async () => {
  for (const [paymentId] of store.getPendingPayments()) {
    try {
      await finalizeIfPaid(paymentId);
    } catch (err) {
      console.error(`Ошибка фоновой проверки платежа ${paymentId}:`, err.response?.data || err.message);
    }
  }
}, config.pollIntervalMs);

bot.launch();
console.log('Бот запущен (long polling).');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
