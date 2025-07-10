const { Telegraf, session } = require('telegraf');
const express = require('express');
const bodyParser = require('body-parser');

const BOT_TOKEN = '7642749455:AAGY8AWxrP0yhuc6Lprzs3j3Cp5QR1JRYRQ';
const bot = new Telegraf(BOT_TOKEN);
bot.use(session());

const recentPayments = []; // Временное хранилище последних оплат

// === /start ===
bot.start((ctx) => {
  ctx.reply('❄️ Добро пожаловать в IceMind! Выберите действие:', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Один прогноз — 500 ₽', url: 'https://pay.cloudtips.ru/p/e4170f25' }],
        [{ text: 'Подписка на месяц — 3 000 ₽', url: 'https://pay.cloudtips.ru/p/4defa6ee' }],
        [{ text: '✅ Я оплатил', callback_data: 'check_payment' }]
      ]
    }
  });

  ctx.reply(
    '⚠️ *Важно перед оплатой!*\n\n' +
    '🔓 Не забудьте *убрать галочку* «_Возместить комиссию сервиса_» — комиссия уже включена, вам платить больше не нужно.\n\n' +
    '📄 Ознакомьтесь с условиями перед оплатой:\n\n' +
    '📜 [Публичная оферта](https://spiffy-kulfi-edd385.netlify.app/oferta.html)\n' +
    '🔐 [Политика конфиденциальности](https://spiffy-kulfi-edd385.netlify.app/politika.html)',
    { parse_mode: 'Markdown' }
  );
});

// === Обработка кнопки "Я оплатил"
bot.action('check_payment', async (ctx) => {
  ctx.answerCbQuery();
  ctx.session.awaitingEmail = true;
  await ctx.reply('✉️ Введите email, который вы указали при оплате:');
});

// === Обработка ввода email
bot.on('text', async (ctx) => {
  if (ctx.session.awaitingEmail) {
    const email = ctx.message.text.trim().toLowerCase();
    ctx.session.awaitingEmail = false;

    const found = recentPayments.find(p => p.customer_email.toLowerCase() === email);

    if (found) {
      await ctx.reply('✅ Оплата найдена! Вас скоро добавят в VIP-чат.');
      await bot.telegram.sendMessage('@Anton_9700',
        `👤 Пользователь оплатил и ввёл email:\n\n📨 Email: ${email}\n💸 Сумма: ${found.amount} ₽\n` +
        `🆔 Telegram: @${ctx.from.username || 'без username'} (ID: ${ctx.from.id})`);
    } else {
      await ctx.reply('❌ Оплата с таким email не найдена.\nПроверьте правильность или подождите 1–2 минуты и попробуйте снова.');
    }
  }
});

// === CloudTips webhook
const app = express();
app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
  const data = req.body;
  console.log('💰 Webhook:', data);

  if (data && data.amount && data.customer_email) {
    // Сохраняем в память
    recentPayments.push({
      customer_email: data.customer_email,
      amount: data.amount,
      timestamp: Date.now()
    });

    // Очищаем старые записи (старше 30 мин)
    const cutoff = Date.now() - 30 * 60 * 1000;
    while (recentPayments.length > 0 && recentPayments[0].timestamp < cutoff) {
      recentPayments.shift();
    }

    // Уведомляем тебя
    const msg = `💳 Оплата получена:\n\n📨 Email: ${data.customer_email}\n💸 Сумма: ${data.amount} ₽`;
    await bot.telegram.sendMessage('@Anton_9700', msg);
  }

  res.sendStatus(200);
});

// === Web-сервер
app.get('/', (req, res) => {
  res.send('✅ IceMind Bot работает!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер на порту ${PORT}`);
});

// === Удаление лишних команд
bot.launch()
  .then(() => {
    console.log('✅ Бот запущен');
    bot.telegram.setMyCommands([
      {
        command: 'start',
        description: '❄️ Начать работу и оплатить VIP'
      }
    ]);
  })
  .catch((err) => console.error('❌ Ошибка запуска:', err));
