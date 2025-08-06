import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

// Инициализация бота
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

// Обработка команды /start
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

// Express-сервер
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
  res.send('Bot is running.');
});

// Оферта
app.get('/offer', (req, res) => {
  res.send(`
    <h1>Договор оферты</h1>
    <p>Настоящий документ является публичной офертой проекта IceMind.</p>
    <p>После оплаты пользователь получает доступ в VIP-группу на ограниченный срок.</p>
    <p>Пользователь осознаёт риски, связанные с прогнозами на спорт, и принимает условия использования.</p>
    <p>Возврат средств не предусмотрен. Доступ предоставляется в полном объёме с момента оплаты.</p>
  `);
});

// Политика конфиденциальности
app.get('/privacy', (req, res) => {
  res.send(`
    <h1>Политика конфиденциальности</h1>
    <p>Проект IceMind не собирает персональные данные пользователей.</p>
    <p>Платёжные данные обрабатываются через CloudTips, согласно их политике безопасности.</p>
    <p>Контакты и Telegram-аккаунты не передаются третьим лицам.</p>
  `);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


