const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const axios = require('axios');

const token = '7642749455:AAGY8AWxrP0yhuc6Lprzs3j3Cp5QR1JRYRQ';
const bot = new TelegramBot(token, { polling: true });

const ADMIN_ID = 536582003; // твой Telegram ID
const VIP_CHAT_ID = -1005706679786; // ID VIP-группы
const PAYMENTS = {
  daily: { amount: 500, duration: 1, name: "Один прогноз" },
  monthly: { amount: 3000, duration: 30, name: "Подписка на месяц" },
  season: { amount: 18000, duration: 270, name: "Подписка на сезон (9 месяцев)" }
};

const activeUsers = new Map();

const app = express();
const PORT = process.env.PORT || 10000;
app.get('/', (_, res) => res.send('Бот работает'));
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

// Старт
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const text = `
👋 Приветствуем в *IceMind* — аналитика с холодной головой 🧊

🎯 Что доступно:
• Один прогноз — 500 ₽
• Подписка на месяц — 3 000 ₽
• Подписка на сезон (9 месяцев) — 18 000 ₽

📌 Без лудомании. Только расчёт и аналитика.

👇 Выбери нужный тариф:
`;

  const options = {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [{ text: '📄 Один прогноз — 500 ₽', callback_data: 'buy_daily' }],
        [{ text: '📆 Месяц — 3 000 ₽', callback_data: 'buy_monthly' }],
        [{ text: '🎯 Сезон — 18 000 ₽', callback_data: 'buy_season' }]
      ]
    }
  };

  bot.sendMessage(chatId, text, options);
});

// Обработка кнопок
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const username = query.from.username || 'Без ника';

  const type = query.data.replace('buy_', '');
  const pay = PAYMENTS[type];

  const links = {
    daily: 'https://pay.cloudtips.ru/p/e4170f25',
    monthly: 'https://pay.cloudtips.ru/p/4defa6ee',
    season: 'https://pay.cloudtips.ru/p/97054a9d'
  };

  await bot.sendPhoto(chatId, 'https://telegra.ph/file/e39df060a25c276cc34b8.jpg', {
    caption: `⚠️ Перед оплатой убери галочку *"Возместить комиссию сервиса"* — проект берёт её на себя.

💳 *${pay.name}* — ${pay.amount} ₽

После оплаты тебе автоматически откроется доступ.`,
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [{ text: '🔗 Перейти к оплате', url: links[type] }]
      ]
    }
  });

  bot.answerCallbackQuery(query.id);
});

// Приём уведомлений от CloudTips (симуляция)
app.post('/notify', express.json(), async (req, res) => {
  const { amount, username, tg_id } = req.body;
  const chatId = parseInt(tg_id);

  let matchedType = null;
  for (const key in PAYMENTS) {
    if (PAYMENTS[key].amount === amount) {
      matchedType = key;
      break;
    }
  }

  if (!matchedType) return res.status(400).send('Unknown payment');

  const accessTime = PAYMENTS[matchedType].duration;
  const planName = PAYMENTS[matchedType].name;

  try {
    await bot.sendMessage(chatId, `✅ Оплата за *${planName}* получена!\nТебе открыт доступ в VIP.`);
    await bot.sendMessage(ADMIN_ID, `💸 *Оплата:* ${amount} ₽\n👤 @${username || 'Без ника'}\n🕐 ${planName}`);
    await bot.sendMessage(VIP_CHAT_ID, `👤 @${username || 'Без ника'} присоединился к VIP!`);

    await bot.sendMessage(chatId, `🔐 Вход в VIP: https://t.me/+pJs7l-ZYOHVhNmJi`);
    await bot.sendMessage(VIP_CHAT_ID, `/addvip ${chatId}`);

    await bot.addChatMember(VIP_CHAT_ID, chatId);
    activeUsers.set(chatId, Date.now() + accessTime * 24 * 60 * 60 * 1000);

    // Удаление по таймеру
    setTimeout(async () => {
      try {
        await bot.sendMessage(chatId, '⏳ Срок действия подписки завершён.');
        await bot.kickChatMember(VIP_CHAT_ID, chatId);
        await bot.sendMessage(ADMIN_ID, `🚫 Пользователь @${username} удалён из VIP`);
        activeUsers.delete(chatId);
      } catch (err) {
        console.error('Ошибка при удалении:', err.message);
      }
    }, accessTime * 24 * 60 * 60 * 1000);

    res.status(200).send('OK');
  } catch (err) {
    console.error('Ошибка при доступе:', err.message);
    res.status(500).send('Error');
  }
});


