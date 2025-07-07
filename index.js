const TelegramBot = require('node-telegram-bot-api');

// Вставь сюда свой токен бота
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// Команда /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, 'Привет! Ты в IceMind — хоккей с холодной головой 🧊\n\nВыбери действие:', {
    reply_markup: {
      keyboard: [
        ['📜 Инструкция', '💳 Тарифы и подписка'],
        ['🔐 Проверка VIP-доступа', '🛠 Связь с админом'],
        ['📋 Правила канала']
      ],
      resize_keyboard: true,
      one_time_keyboard: false
    }
  });
});

// Обработка нажатий на кнопки
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === '📜 Инструкция') {
    bot.sendMessage(chatId, '🔹 Инструкция по началу работы:\n1. Ознакомься с тарифами\n2. Оплати подписку\n3. Получи доступ в VIP\n\nЕсли что — жми "🛠 Связь с админом"');
  }

  else if (text === '💳 Тарифы и подписка') {
    bot.sendMessage(chatId, '💰 Актуальные тарифы:\n▫️ 1 прогноз — 500 ₽\n▫️ Месяц — 3 000 ₽\n▫️ Сезон (9 мес) — 18 000 ₽');
  }

  else if (text === '🔐 Проверка VIP-доступа') {
    bot.sendMessage(chatId, '🔎 Проверка доступа VIP: если ты оплатил подписку — доступ открыт. Если нет — перейди к оплате.');
  }

  else if (text === '🛠 Связь с админом') {
    bot.sendMessage(chatId, '📩 Свяжись с админом: @Anton_9700');
  }

  else if (text === '📋 Правила канала') {
    bot.sendMessage(chatId, '📜 Основные правила:\n— Только холодный расчёт, без лудомании\n— Соблюдай банк-менеджмент\n— Не нарушай правила чата\n— Относись с уважением к аналитике');
  }
});
