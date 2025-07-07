const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const bodyParser = require('body-parser');

const token = '7642749455:AAGY8AWxrP0yhuc6Lprzs3j3Cp5QR1JRYRQ'; // твой токен
const bot = new TelegramBot(token);
const app = express();

app.use(bodyParser.json());

// Webhook для Telegram
app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Ответ на /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Добро пожаловать в IceMind!');
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  bot.setWebHook(`https://icemind-bot-cloudtips.onrender.com/bot${token}`);
  console.log(`Сервер запущен на порту ${PORT}`);
});
