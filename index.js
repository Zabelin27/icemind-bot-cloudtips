// index.js — IceMind (обновлённый)
// Требования: node-telegram-bot-api, dotenv, express
// ENV: TELEGRAM_TOKEN (обязательно), PORT (optional), BANNER_URL (optional)

import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

// === Конфиг ссылок и текстов ===
const LINKS = {
  ONE_TIP: 'https://yoomoney.ru/fundraise/1C8DL945HRQ.250820', // 500 ₽ — один прогноз (ЮMoney)
  MONTH_VIP: 'https://yoomoney.ru/fundraise/1C8DMGFUH1N.250820', // 3 000 ₽ — месяц VIP (ЮMoney)
  OFFER: 'https://spiffy-kulfi-edd385.netlify.app/oferta.html',
  POLICY: 'https://spiffy-kulfi-edd385.netlify.app/policy.html',
};

const ADMIN = '@Anton_9700';
const VIP_INFO = {
  // На текущем этапе добавление вручную — авто‑выдача подключим отдельно
  manualJoinNote: `\n\n📩 После оплаты отправьте чек администратору — ${ADMIN}. Он добавит вас в VIP.`,
};

// Текст‑инструкция перед оплатой (если нет баннера)
const INSTRUCTION_TEXT = (
  '🧊 ВАЖНО: перед оплатой
' +
  '• На странице оплаты вы увидите заголовок вроде «Сбор денег на офисные нужды».
' +
  '• Это особенность платёжной системы. Продолжайте: нажмите «Отправить» → оплатите.
' +
  '• Снимите галочку «Возместить комиссию сервиса», т.к. комиссию проект берёт на себя.
'
);

// === Инициализация бота ===
if (!process.env.TELEGRAM_TOKEN) {
  throw new Error('TELEGRAM_TOKEN не задан в .env');
}

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

// Универсальные клавиатуры
const mainKeyboard = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: 'ОДИН ПРОГНОЗ — 500 ₽', callback_data: 'pay_one' },
      ],
      [
        { text: 'ПОДПИСКА НА МЕСЯЦ (VIP) — 3 000 ₽', callback_data: 'pay_month' },
      ],
      [
        { text: 'Оферта', url: LINKS.OFFER },
        { text: 'Политика', url: LINKS.POLICY },
      ],
    ],
  },
};

function paymentButton(url) {
  return {
    reply_markup: {
      inline_keyboard: [[{ text: 'Перейти к оплате', url }]],
    },
    disable_web_page_preview: true,
  };
}

function getStartMessage() {
  return (
    `Добро пожаловать в <b>IceMind</b>! 🧊\n\n` +
    `Здесь ты получаешь:\n` +
    `• Прогнозы на хоккей с холодной головой\n` +
    `• Аналитику без лудомании\n` +
    `• Прозрачную статистику и поддержку 📊\n\n` +
    `<b>Выбери тариф:</b>\n` +
    `🔻 <b>ОДИН ПРОГНОЗ — 500 ₽</b>\n` +
    `🔷 <b>ПОДПИСКА НА МЕСЯЦ (VIP) — 3 000 ₽</b>\n\n` +
    `⚠️ На странице оплаты вы увидите системный заголовок. Это <b>особенность платёжной системы</b>. ` +
    `Просто нажмите «Отправить» → оплатите. ✅` +
    VIP_INFO.manualJoinNote +
    `\n\n📄 Документы:\n` +
    `• <a href="${LINKS.OFFER}">Полная оферта</a>\n` +
    `• <a href="${LINKS.POLICY}">Политика конфиденциальности</a>`
  );
}

// /start
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    await bot.sendMessage(chatId, getStartMessage(), {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      ...mainKeyboard,
    });
  } catch (e) {
    console.error('Ошибка /start:', e);
  }
});

// Колбэки оплаты — сначала баннер‑инструкция (если задан BANNER_URL), затем кнопка на оплату
bot.on('callback_query', async (query) => {
  const chatId = query.message?.chat.id;
  if (!chatId) return;

  try {
    if (query.data === 'pay_one') {
      await showInstructionThenLink(chatId, LINKS.ONE_TIP);
      await bot.answerCallbackQuery(query.id);
      return;
    }
    if (query.data === 'pay_month') {
      await showInstructionThenLink(chatId, LINKS.MONTH_VIP);
      await bot.answerCallbackQuery(query.id);
      return;
    }
  } catch (e) {
    console.error('Ошибка callback_query:', e);
  }
});

async function showInstructionThenLink(chatId, url) {
  const bannerUrl = process.env.BANNER_URL; // опционально: https://.../banner-instruction.png
  if (bannerUrl) {
    // 1) Фото‑баннер
    await bot.sendPhoto(chatId, bannerUrl, {
      caption: INSTRUCTION_TEXT,
    });
  } else {
    // 1) Текст‑инструкция (fallback)
    await bot.sendMessage(chatId, INSTRUCTION_TEXT, { disable_web_page_preview: true });
  }

  // 2) Кнопка «Перейти к оплате»
  await bot.sendMessage(
    chatId,
    'Готово? Нажмите кнопку ниже, чтобы перейти к оплате ⤵️',
    paymentButton(url)
  );
}

// Команда /docs — быстрые ссылки на оферту и политику
bot.onText(/\/docs/, async (msg) => {
  const chatId = msg.chat.id;
  await bot.sendMessage(
    chatId,
    `📄 Документы:\n• <a href="${LINKS.OFFER}">Полная оферта</a>\n• <a href="${LINKS.POLICY}">Политика конфиденциальности</a>`,
    { parse_mode: 'HTML', disable_web_page_preview: true }
  );
});

// Мини‑сервер для Render
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (_req, res) => {
  res.send('IceMind бот работает!');
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
