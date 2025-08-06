import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

dotenv.config();

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  const message = `
Добро пожаловать в IceMind! 🧊

Здесь ты получаешь:
• Прогнозы на хоккей с холодной головой
• Аналитику без лудомании
• Прозрачную статистику и поддержку

📊 Выбери тариф:
🔻 Один прогноз — 500 ₽  
🔷 Подписка на месяц — 3 000 ₽

❗ ПЕРЕД ОПЛАТОЙ УБЕРИ ГАЛОЧКУ «ВОЗМЕСТИТЬ КОМИССИЮ СЕРВИСА»

💳 Ссылки на оплату:
• Один прогноз: https://pay.cloudtips.ru/p/e4170f25  
• Подписка на месяц: https://pay.cloudtips.ru/p/4defa6ee

🧾 После оплаты:
Отправь скриншот чека админу — @Anton_9700  
Он вручную добавит тебя в VIP-группу.

📄 Документы:
• Оферта: https://icemind-bot-cloudtips.onrender.com/offer  
• Политика конфиденциальности: https://icemind-bot-cloudtips.onrender.com/privacy
`;

  bot.sendMessage(chatId, message);
});

