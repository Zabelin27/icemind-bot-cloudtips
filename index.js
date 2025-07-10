const { Telegraf } = require('telegraf');
const express = require('express');
const bodyParser = require('body-parser');

// Токен бота
const BOT_TOKEN = '7642749455:AAGY8AWxrP0yhuc6Lprzs3j3Cp5QR1JRYRQ';
const bot = new Telegraf(BOT_TOKEN);

// /start — одно сообщение с Markdown и кнопками
bot.start((ctx) => {
  const message =
    '👋 *Добро пожаловать в IceMind!*\n\n' +
    '❄️ Мы — аналитический проект по хоккею. Только холодный расчёт и прозрачная отчётность.\n\n' +
    '🔓 *Важно!* IceMind берёт комиссию на себя — вы платите только за подписку.\n' +
    '👉 Уберите галочку «Возместить комиссию сервиса» перед оплатой.\n\n' +
    '✅ После оплаты присылайте скриншот чека *только админу* — @Anton_9700\n' +
    '🤖 После подтверждения бот добавит вас в VIP-группу.\n\n' +
    '💎 *Тарифы:*\n' +
    '• Один прогноз — *500₽* (вместо ~~1000₽~~)\n' +
    '• Подписка на месяц — *3000₽* (вместо ~~5000₽~~)\n\n' +
    'Выберите опцию и перейдите к оплате:';

  ctx.reply(message, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Один прогноз — 500 ₽', url: 'https://pay.cloudtips.ru/p/e4170f25' }],
        [{ text: 'Подписка на месяц — 3 000 ₽', url: 'https://pay.cloudtips.ru/p/4defa6ee' }]
      ]
    }
  });
});

// Запуск бота
bot.launch()
  .then(() => console.log('✅ Бот запущен'))
  .catch(console.error);

// Express-сервер для Render и webhook показать состояние
const app = express();
app.use(bodyParser.json());
app.get('/', (req, res) => res.send('✅ IceMind Bot работает!'));
app.post('/webhook', (req, res) => {
  console.log('💰 Webhook:', req.body);
  res.sendStatus(200);
});

// Слушаем порт
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Сервер на порту ${PORT}`));
