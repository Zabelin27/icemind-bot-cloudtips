import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

// Инициализация бота (polling)
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

// /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  const message = `
Добро пожаловать в <b>IceMind</b>! 🧊

Здесь ты получаешь:
• Прогнозы на хоккей с холодной головой
• Аналитику без лудомании
• Прозрачную статистику и поддержку 📊

<b>Выбери тариф:</b>
🔻 <b>ОДИН ПРОГНОЗ — 500 ₽</b>
🔷 <b>ПОДПИСКА НА МЕСЯЦ (VIP) — 3 000 ₽</b>

⚠️ При переходе по ссылке вы увидите кнопку «Отправить» и заголовок
«Сбор денег на IT-проект». Это особенность ЮMoney.
Просто нажмите «Отправить» → оплатите. ✅

🔗 <b>ССЫЛКИ НА ОПЛАТУ:</b>
• ОДИН ПРОГНОЗ: <a href="https://yoomoney.ru/fundraise/1C8DL945HRQ.250820">Оплатить 500 ₽</a>
• ПОДПИСКА НА МЕСЯЦ: <a href="https://yoomoney.ru/fundraise/1C8DMGFUH1N.250820">Оплатить 3 000 ₽</a>

📩 После оплаты отправь чек администратору — @Anton_9700
Он вручную добавит тебя в VIP-группу.

📄 Документы:
• <a href="https://spiffy-kulfi-edd385.netlify.app/oferta.html">Публичная оферта</a>
• <a href="https://spiffy-kulfi-edd385.netlify.app/policy.html">Политика конфиденциальности</a>
  `;

  bot.sendMessage(chatId, message, {
    parse_mode: 'HTML',
    disable_web_page_preview: true,
  });
});

// HTTP-сервер для Render
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (_req, res) => {
  res.send('IceMind бот работает!');
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

