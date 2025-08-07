import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

// Инициализация бота
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

// Ответ на /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  const message = `
Добро пожаловать в IceMind! 🧊

Здесь ты получаешь:
• Прогнозы на хоккей с холодной головой
• Аналитику без лудомании
• Прозрачную статистику и поддержку

🎯 ВЫБЕРИ ТАРИФ:
🔻 ОДИН ПРОГНОЗ — 500 ₽
🔷 ПОДПИСКА НА МЕСЯЦ — 3 000 ₽

‼️ ПЕРЕД ОПЛАТОЙ УБЕРИ ГАЛОЧКУ «ВОЗМЕСТИТЬ КОМИССИЮ СЕРВИСА»
📌 ПРОЕКТ БЕРЁТ КОМИССИЮ НА СЕБЯ — ты платишь только за подписку, без переплат!

📎 ССЫЛКИ НА ОПЛАТУ:
• ОДИН ПРОГНОЗ: https://pay.cloudtips.ru/p/e4170f25
• ПОДПИСКА НА МЕСЯЦ: https://pay.cloudtips.ru/p/4defa6ee

📩 После оплаты отправь чек администратору — @Anton_9700
Он вручную добавит тебя в VIP-группу.

📄 Документы:
• Оферта: https://spiffy-kulfi-edd385.netlify.app/oferta.html
• Политика конфиденциальности: https://spiffy-kulfi-edd385.netlify.app/politika.html
`;

  bot.sendMessage(chatId, message);
});

// Запуск сервера (для Render)
const app = express();
const PORT = process.env.PORT || 10000;
app.get('/', (req, res) => {
  res.send('IceMind Bot is running!');
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

