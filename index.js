const TelegramBot = require("node-telegram-bot-api");

// === ТВОЙ ТОКЕН БОТА ===
const token = "7642749455:AAGY8AWxrP0yhuc6Lprzs3j3Cp5QR1JRYRQ";
const bot = new TelegramBot(token, { polling: true });

// === ID VIP-группы ===
const vipGroupId = -1005706679786;

// === ССЫЛКИ НА ОПЛАТУ ЮMoney ===
const oneForecastLink = "https://yoomoney.ru/to/4100118622589732/500"; // 500 ₽
const monthVipLink = "https://yoomoney.ru/to/4100118622589732/3000";  // 3000 ₽

// === СТАРТ ===
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  const message = `
Добро пожаловать в <b>IceMind</b> 🧊

Здесь ты получишь доступ к аналитическим прогнозам по хоккею без лудомании и лишних эмоций.

⚠️ При переходе по ссылке вы увидите кнопку <b>«Отправить»</b> и заголовок 
<b>«Сбор денег на IT-проект»</b>.  
Не обращайте внимания — это особенности ЮMoney.  
Просто нажмите <b>«Отправить»</b> → введите сумму (она уже зафиксирована) → оплатите.

<b>Тарифы:</b>
- 🔹 <b>Подписка на 1 прогноз</b> — 500 ₽
- 🔹 <b>Подписка на VIP месяц</b> — 3000 ₽

👇 Выберите подходящий вариант:
  `;

  const options = {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "🔮 Подписка на 1 прогноз — 500 ₽", url: oneForecastLink }],
        [{ text: "🔥 Подписка на VIP месяц — 3000 ₽", url: monthVipLink }],
      ],
    },
  };

  bot.sendMessage(chatId, message, options);
});

// === ЛОГИРОВАНИЕ ОПЛАТ (вручную добавлять в будущем) ===
// Здесь можно будет сделать проверку по API ЮMoney, если нужно автоматизировать
