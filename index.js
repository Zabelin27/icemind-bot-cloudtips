require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const message = `
Добро пожаловать в IceMind!

❄️ Здесь ты получаешь:
• Прогнозы на хоккей с холодной головой
• Аналитику без лудомании
• Прозрачную статистику и поддержку

👇 Выбери тариф:
1️⃣ Один прогноз — 500 ₽
📅 Подписка на месяц — 3 000 ₽

Перед оплатой убери галочку «Возместить комиссию сервиса».

Ссылки на оплату:
— Один прогноз: https://pay.cloudtips.ru/p/e4170f25
— Подписка на месяц: https://pay.cloudtips.ru/p/4defa6ee

После оплаты бот откроет доступ.
  `;
  bot.sendMessage(chatId, message);
});
