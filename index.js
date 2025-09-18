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
🧊 <b>Добро пожаловать в IceMind!</b>  

Здесь ты получаешь:  
✅ Прогнозы на хоккей с холодной головой  
✅ Аналитику без лудомании  
✅ Прозрачную статистику и поддержку 📊  

🔻 <b>Выбери тариф:</b>  
• Один прогноз — 500 ₽  
• VIP-подписка на месяц — 3 000 ₽  

⚠️ При оплате будет заголовок <b>«офисные нужды»</b> — это нормально, просто жми «Перевести» ✅  

🔗 <b>ССЫЛКИ ДЛЯ ОПЛАТЫ:</b>  
👉 <a href="https://yoomoney.ru/fundraise/1C8DL945HRQ.250820">Оплатить 500 ₽</a>  
👉 <a href="https://yoomoney.ru/fundraise/1C8DMGFUH1N.250820">Оплатить 3 000 ₽</a>  

📩 После оплаты отправь чек админу — <b>@Anton_9700</b>  
Он вручную добавит тебя в VIP-группу уже сегодня 🚀  

📄 <b>Документы:</b>  
• <a href="https://spiffy-kulfi-edd385.netlify.app/oferta.html">Полная оферта</a>  
• <a href="https://spiffy-kulfi-edd385.netlify.app/policy.html">Политика конфиденциальности</a>
`;

  bot.sendMessage(chatId, message, {
    parse_mode: 'HTML',
    disable_web_page_preview: true,
  });
});

// Мини-сервер для Render
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (_req, res) => {
  res.send('IceMind бот работает!');
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});



