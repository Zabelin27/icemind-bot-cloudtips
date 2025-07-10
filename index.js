const { Telegraf } = require('telegraf');
const express = require('express');
const bodyParser = require('body-parser');

// === Настройки ===
const BOT_TOKEN = '7642749455:AAGY8AWxrP0yhuc6Lprzs3j3Cp5QR1JRYRQ';
const bot = new Telegraf(BOT_TOKEN);

// === Команда /start ===
bot.start((ctx) => {
  // Приветственное сообщение с условиями и ссылками на документы
  ctx.reply(
    '👋 Добро пожаловать в IceMind!\n\n' +
    '❄️ Мы — аналитический проект по хоккею. Забудь про эмоции и «чуйку». Только хладнокровная статистика и прозрачная отчётность.\n\n' +
    '🔓 *Важно!* Проект IceMind берёт комиссию на себя — вам нужно оплатить только стоимость подписки.\n' +
    '👉 Уберите галочку «Возместить комиссию сервиса» перед оплатой.\n\n' +
    '📄 Условия:\n' +
    '📜 [Публичная оферта](https://spiffy-kulfi-edd385.netlify.app/oferta.html)\n' +
    '🔐 [Политика конфиденциальности](https://spiffy-kulfi-edd385.netlify.app/politika.html)',
    { parse_mode: 'Markdown' }
  );

  // Кнопки тарифов с зачёркнутыми старыми ценами
  ctx.reply(
    '🔹 Один прогноз — ~~1000₽~~ 500₽\n' +
    '🔹 Подписка на месяц — ~~5000₽~~ 3000₽',
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Один прогноз — 500 ₽', url: 'https://pay.cloudtips.ru/p/e4170f25' }],
          [{ text: 'Подписка на месяц — 3 000 ₽', url: 'https://pay.cloudtips.ru/p/4defa6ee' }]
        ]
      }
    }
  );

  // Инструкция по присылке скрина чека
  ctx.reply(
    '✅ После оплаты пришлите скриншот чека или квитанции сюда или админу *@Anton_9700*.\n' +
    '🤖 После проверки бот автоматически добавит вас в VIP-группу.',
    { parse_mode: 'Markdown' }
  );
});

// === Запуск бота и настройка команды ===
bot.launch()
  .then(() => {
    console.log('✅ Бот IceMind запущен');
    return bot.telegram.setMyCommands([
      { command: 'start', description: '⛸️ Начать и оплатить доступ' }
    ]);
  })
  .then(() => console.log('✅ Команда /start установлена'))
  .catch((err) => console.error('❌ Ошибка запуска бота:', err));

// === Express-сервер для Render и Webhook от CloudTips ===
const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('✅ IceMind Bot работает!');
});

app.post('/webhook', async (req, res) => {
  const data = req.body;
  console.log('💰 Webhook:', data);

  if (data && data.amount && data.customer_email) {
    // Уведомление админу о платеже
    await bot.telegram.sendMessage(
      '@Anton_9700',
      `💳 *Оплата получена!*\n\n👤 Email: ${data.customer_email}\n💸 Сумма: ${data.amount} ₽`,
      { parse_mode: 'Markdown' }
    );
  }

  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Сервер на порту ${PORT}`));
