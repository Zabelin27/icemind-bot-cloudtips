const { Telegraf } = require('telegraf');
const express = require('express');
const bodyParser = require('body-parser');

// Токен бота
const BOT_TOKEN = '7642749455:AAGY8AWxrP0yhuc6Lprzs3j3Cp5QR1JRYRQ';
const bot = new Telegraf(BOT_TOKEN);

// /start
bot.start((ctx) => {
  // 1) Приветствие, условия, чек админу и ссылки
  ctx.reply(
    '👋 Добро пожаловать в IceMind!\n' +
    'Мы — аналитический проект по хоккею.\n' +
    'Только холодный расчёт и прозрачная отчётность.\n\n' +
    '🔓 Важно! IceMind берёт комиссию на себя — вы платите только за подписку.\n' +
    '👉 Уберите галочку «Возместить комиссию сервиса» перед оплатой.\n\n' +
    '✅ После оплаты пришлите скриншот чека ТОЛЬКО админу — @Anton_9700\n' +
    '🤖 После подтверждения бот добавит вас в VIP-группу.\n\n' +
    '📄 Условия:\n' +
    '• Публичная оферта: https://spiffy-kulfi-edd385.netlify.app/oferta.html\n' +
    '• Политика конфиденциальности: https://spiffy-kulfi-edd385.netlify.app/politika.html'
  );

  // 2) Тарифы + кнопки оплаты
  ctx.reply(
    '💎 Тарифы:\n' +
    '• Один прогноз — 500 ₽ (вместо 1000 ₽)\n' +
    '• Подписка на месяц — 3000 ₽ (вместо 5000 ₽)\n\n' +
    'Нажмите на кнопку, чтобы перейти к оплате:',
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

// Запуск бота
bot.launch()
  .then(() => console.log('✅ Бот запущен'))
  .catch((err) => console.error('❌ Ошибка запуска бота:', err));

// Express + Webhook
const app = express();
app.use(bodyParser.json());
app.get('/', (req, res) => res.send('✅ IceMind Bot работает!'));
app.post('/webhook', (req, res) => {
  console.log('💰 Webhook:', req.body);
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Сервер на порту ${PORT}`));
