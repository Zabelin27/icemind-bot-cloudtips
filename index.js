require('dotenv').config();
const { Telegraf } = require('telegraf');
const express = require('express');
const bodyParser = require('body-parser');

const bot = new Telegraf(process.env.BOT_TOKEN);

// /start
bot.start((ctx) => {
  if (ctx.message.chat.type !== 'private') return;

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

// /help
bot.command('help', (ctx) => {
  if (ctx.message.chat.type !== 'private') return;

  ctx.reply(
    '🧊 Проект IceMind\n' +
    '— аналитика и ставки на хоккей с холодной головой.\n\n' +
    '💳 Оплата:\n' +
    '• Один прогноз — 500 ₽: https://pay.cloudtips.ru/p/e4170f25\n' +
    '• Месяц — 3 000 ₽: https://pay.cloudtips.ru/p/4defa6ee\n\n' +
    '📌 После оплаты — чек администратору: @Anton_9700\n' +
    '📄 Условия: https://spiffy-kulfi-edd385.netlify.app/oferta.html'
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
