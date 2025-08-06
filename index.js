import express from 'express';
import dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';

dotenv.config();

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const message = `
Добро пожаловать в IceMind!

❄️ Здесь ты получаешь:
• Прогнозы на хоккей с холодной головой
• Аналитику без лудомании
• Прозрачную статистику и поддержку

📦 Выбери тариф:
🔹 Один прогноз — 500 ₽
🔹 Подписка на месяц — 3 000 ₽

Перед оплатой убери галочку «Возместить комиссию сервиса».

Ссылки на оплату:
— Один прогноз: https://pay.cloudtips.ru/p/e4170f25
— Подписка на месяц: https://pay.cloudtips.ru/p/4defa6ee

После оплаты бот откроет доступ.
  `;
  bot.sendMessage(chatId, message);
});

// 🧠 Заглушка для Render — Express сервер (порт 10000)
const app = express();
app.get("/", (req, res) => res.send("Bot is running."));
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Fake server running on port ${PORT}`);
});
