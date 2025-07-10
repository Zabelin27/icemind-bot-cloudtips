const { Telegraf } = require('telegraf');
const express = require('express');
const bodyParser = require('body-parser');

// === Настройки ===
const BOT_TOKEN = '7642749455:AAGY8AWxrP0yhuc6Lprzs3j3Cp5QR1JRYRQ';
const bot = new Telegraf(BOT_TOKEN);

// === Команда /start ===
bot.start(async (ctx) => {
  // 1) Приветствие, условия и инструкция по чеку админу
  await ctx.replyWithMarkdown(
    `👋 *Добро пожаловать в IceMind!*\n\n` +
    `❄️ Мы — аналитический проект по хоккею. Забудь про эмоции и «чуйку». Только хладнокровная статистика и прозрачная отчётность.\n\n` +
    `🔓 *Важно!* IceMind берёт комиссию на себя — вы платите только за подписку.\n` +
    `👉 Уберите галочку «Возместить комиссию сервиса» перед оплатой.\n\n` +
    `✅ После оплаты присылайте скриншот чека *только админу* — @Anton_9700\n` +
    `🤖 После подтверждения бот автоматически добавит вас в VIP-группу.\n\n` +
    `📄 Условия:\n` +
    `🔹 [Публичная оферта](https://spiffy-kulfi-edd385.netlify.app/oferta.html)\n` +
    `🔹 [Политика конфиденциальности](https://spiffy-kulfi-edd385.netlify.app/politika.html)`
  );

  // 2) Тарифы и кнопки оплаты
  await ctx.replyWithMarkdown(
    `💎 *Тарифы:*\n` +
    `• Один прогноз — *500 ₽* (вместо ~~1000 ₽~~)\n` +
    `• Подписка на месяц — *3000 ₽* (вместо ~~5000 ₽~~)\n\n` +
    `Выберите опцию и перейдите к оплате:`,
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Один прогноз — 500 ₽', url: 'https://pay.cloudtips.ru/p/e4170f25' }],
          [{ text: 'Подписка на месяц — 3 000 ₽', url: 'https://pay.cloudtips.ru/p/4defa6ee' }]
        ]
      }
    }
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
  .catch((err) => console.error('❌ Ошибка запуска:', err));

// === Express-сервер и Webhook от CloudTips ===
const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('✅ IceMind Bot работает!'));

app.post('/webhook', async (req, res) => {
  const data = req.body;
  console.log('💰 Webhook:', data);
  if (data && data.amount && data.customer_email) {
    await bot.telegram.sendMessage(
      '@Anton_9700',
      `💳 *Оплата получена!*\n\n👤 Email: ${data.customer_email}\n💸 Сумма: ${data.amount} ₽`,
      { parse_mode: 'Markdown' }
    );
  }
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Сервер запущен на порту ${PORT}`));
