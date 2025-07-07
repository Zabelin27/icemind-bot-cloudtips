const TelegramBot = require('node-telegram-bot-api');

// Вставь сюда свой токен бота
const token = '7642749455:AAGY8AWxrP0yhuc6Lprzs3j3Cp5QR1JRYRQ';

// Создаём бота с использованием polling
const bot = new TelegramBot(token, { polling: true });

// Кнопка "Оплатить подписку"
const payButton = {
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: '💳 Оплатить подписку',
          url: 'https://pay.cloudtips.ru/p/97054a9d' // ← сюда твоя CloudTips-ссылка
        }
      ]
    ]
  }
};

// Команда /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const text = `Привет! Ты в IceMind — хоккей с холодной головой 🧊\n\nЧтобы получить доступ в VIP-чат, нажми кнопку ниже и оплати подписку:`;
  bot.sendMessage(chatId, text, payButton);
});

// Команда /help
bot.onText(/\/help/, (msg) => {
  bot.sendMessage(msg.chat.id, '❓ Частые вопросы:\n\n1. Как получить доступ?\n→ Оплатите подписку по кнопке /start\n\n2. Что входит в VIP?\n→ До 38 прогнозов в месяц, банк-менеджмент, розыгрыши, аналитика.');
});

// Команда /prices
bot.onText(/\/prices/, (msg) => {
  bot.sendMessage(msg.chat.id, '💰 Актуальные тарифы:\n\n• 1 прогноз — 500 ₽\n• Месяц — 3 000 ₽\n• Сезон (9 месяцев) — 18 000 ₽');
});

// Команда /vip
bot.onText(/\/vip/, (msg) => {
  bot.sendMessage(msg.chat.id, '🔎 Проверка VIP-доступа пока работает вручную. Напишите админу: @Anton_9700');
});

// Команда /support
bot.onText(/\/support/, (msg) => {
  bot.sendMessage(msg.chat.id, '👨‍💻 Связь с админом: @Anton_9700');
});

// Команда /rules
bot.onText(/\/rules/, (msg) => {
  bot.sendMessage(msg.chat.id, '📜 Правила канала:\n\n— Только 1–2 ставки в день\n— Строгий банк-менеджмент\n— Не играть на последние деньги\n— Не поднимать сумму после проигрыша\n\nIceMind — холодная голова, никакой лудомании.');
});
