const { Telegraf } = require('telegraf');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

// === Настройки ===
const BOT_TOKEN = '7642749455:AAGY8AWxrP0yhuc6Lprzs3j3Cp5QR1JRYRQ';
const bot = new Telegraf(BOT_TOKEN);

// === Команда /start ===
bot.start((ctx) => {
  ctx.reply(
    '👋 Добро пожаловать в IceMind!\n\n' +
    'Выберите нужный вариант подписки и оплатите доступ:\n\n' +
    '🔓 *Важно! Проект IceMind берёт комиссию на себя* — вам нужно оплатить *только стоимость подписки*.\n' +
    '👉 Поэтому *уберите галочку* «_Возместить комиссию сервиса_» перед оплатой.\n\n' +
    '📄 Ознакомьтесь с условиями перед оплатой:\n\n' +
    '📜 [Публичная оферта](https://spiffy-kulfi-edd385.netlify.app/oferta.html)\n' +
    '🔐 [Политика конфиденциальности](https://spiffy-kulfi-edd385.netlify.app/politika.html)',
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '💡 Один прогноз — 500 ₽', url: 'https://pay.cloudtips.ru/p/e4170f25' }
          ],
          [
            { text: '🔥 Подписка на месяц — 3 000 ₽', url: 'https://pay.cloudtips.ru/p/4defa6ee' }
          ]
        ]
      }
    }
  );
});

// === Запуск бота и установка команд ===
bot.launch()
  .then(() => {
    console.log('✅ Бот IceMind запущен');

    return bot.telegram.setMyCommands([
      {
        command: 'start',
        description: '❄️ Начать работу и оплатить VIP'
      }
    ]);
  })
  .then(() => console.log('✅ Команда /start обновлена'))
  .catch((err) => console.error('❌ Ошибка запуска бота:', err));

// === Express-сервер для Render ===
const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('✅ IceMind Bot работает!');
});

// === Обработка Webhook от CloudTips ===
app.post('/webhook', async (req, res) => {
  const data = req.body;

  console.log('💰 Получен webhook:', data);

  // Пример уведомления админу
  if (data && data.amount && data.customer_email) {
    const message = `💳 *Оплата получена!*\n\n👤 Email: ${data.customer_email}\n💸 Сумма: ${data.amount} ₽`;
    await bot.telegram.sendMessage('@Anton_9700', message, { parse_mode: 'Markdown' });
  }

  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});
