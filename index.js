import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

// Инициализация бота
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

// Ответ на /start
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
🔷 <b>ПОДПИСКА НА МЕСЯЦ — 3 000 ₽</b>  

⚠️ <b>ВАЖНО:</b>  
При переходе по ссылке вы увидите кнопку «Отправить» и заголовок «Сбор денег на IT-проект».  
<b>Не обращайте внимания</b> — это особенности ЮMoney.  
Просто нажмите «Отправить» → введите сумму (она уже зафиксирована) → оплатите.  

🔗 <b>ССЫЛКИ НА ОПЛАТУ:</b>  
• ОДИН ПРОГНОЗ: https://yoomoney.ru/fundraise/payment/odinprognoz  
• ПОДПИСКА НА МЕСЯЦ: https://yoomoney.ru/fundraise/payment/vipmesyac  

📩 После оплаты отправь чек администратору — @Anton_9700  
Он вручную добавит тебя в VIP-группу.  

📄 Документы:  
• Полная оферта: https://spiffy-kulfi-edd385.netlify.app/oferta.html  
• Полная политика конфиденциальности: https://spiffy-kulfi-edd385.netlify.app/politika.html  
  `;

  bot.sendMessage(chatId, message, {
    parse_mode: "HTML",
    disable_web_page_preview: true,
  });
});

// Express-сервер для Render
const app = express();
const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
  res.send("IceMind бот работает!");
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
