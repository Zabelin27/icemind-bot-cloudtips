const { Telegraf } = require('telegraf');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

// === Настройки ===
const BOT_TOKEN = '7642749455:AAGY8AWxrP0yhuc6Lprzs3j3Cp5QR1JRYRQ'; // ← Твой токен
const bot = new Telegraf(BOT_TOKEN);

// === Обработка команды /start ===
bot.start((ctx) => {
  const welcomeText = `
Привет! 👋 Это бот IceMind — здесь ты можешь приобрести доступ к VIP-прогнозам по хоккею 🏒

❄️ Мы используем холодный расчёт, статистику и аналитический подход. Без лудомании, только разум и цифры.

🔐 Перед оплатой обязательно ознакомься с условиями:

📄 Оферта: https://spiffy-kulfi-edd385.netlify.app/oferta.html  
📄 Политика конфиденциальности: https://spiffy-kulfi-edd385.netlify.app/politika.html
`;

  ctx.reply(welcomeText, { disable_web_page_preview: true }).then(() => {
    ctx.reply('Выберите действие:', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Один прогноз — 500 ₽', url: 'https://pay.cloudtips.ru/p/e4170f25' }],
          [{ text: 'Подписка на месяц — 3 000 ₽', url: 'https://pay.cloudtips.ru/p/4defa6ee' }]
        ]
      }
    });
  });
});

// === Запуск бота ===
bot.launch()
  .then(() => console.log('✅ Бот запущен'))
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
    const message = `💳 Оплата получена:\n\n👤 Email: ${data.customer_email}\n💸 Сумма: ${data.amount} ₽`;
    await bot.telegram.sendMessage('@Anton_9700', message);
  }

  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});
