import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

// --- ВАЛИДАЦИЯ ПЕРЕМЕННЫХ ОКРУЖЕНИЯ ---
if (!process.env.TELEGRAM_TOKEN) {
  console.error('❌ TELEGRAM_TOKEN не задан в .env');
  process.exit(1);
}

// --- ИНИЦИАЛИЗАЦИЯ БОТА ---
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

// Оставляем только одну команду /start в приватных чатах,
// а для групп/каналов очищаем список команд (на всякий случай).
(async () => {
  try {
    await bot.setMyCommands(
      [{ command: 'start', description: 'Запуск бота' }],
      { scope: { type: 'default' } }
    );
    await bot.setMyCommands([], { scope: { type: 'all_group_chats' } });
    await bot.setMyCommands([], { scope: { type: 'all_channel_chats' } });
    console.log('✅ Команды бота установлены: только /start');
  } catch (e) {
    console.warn('⚠️ Не удалось выставить команды у бота через API:', e?.message || e);
  }
})();

// --- ХЭНДЛЕР /start ---
bot.onText(/\/start(?:@[\w_]+)?/, async (msg) => {
  const chatId = msg.chat.id;

  const text =
`Добро пожаловать в <b>IceMind</b>! 🧊

Здесь ты получаешь:
• Прогнозы на хоккей с холодной головой
• Аналитику без лудомании
• Прозрачную статистику и поддержку 📊

<b>Выбери тариф:</b>
🔻 <b>ОДИН ПРОГНОЗ — 500 ₽</b>
🔷 <b>ПОДПИСКА НА МЕСЯЦ (VIP) — 3 000 ₽</b>

⚠️ Если на странице оплаты увидишь опцию наподобие
«возместить комиссию сервиса» — <b>не ставь галочку</b>:
комиссию берём на себя. Оплачиваешь только тариф.

После оплаты отправь чек администратору — @Anton_9700.
Он вручную добавит тебя в VIP-группу.

📄 Документы:
• <a href="https://spiffy-kulfi-edd385.netlify.app/oferta.html">Публичная оферта</a>
• <a href="https://spiffy-kulfi-edd385.netlify.app/politika.html">Политика конфиденциальности</a>`;

  try {
    await bot.sendMessage(chatId, text, {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [
          [{ text: '🔥 Один прогноз — 500 ₽', url: 'https://yoomoney.ru/fundraise/1C8DL945HRQ.250820' }],
          [{ text: '💎 Подписка на месяц — 3 000 ₽', url: 'https://yoomoney.ru/fundraise/1C8DMGFUH1N.250820' }],
        ]
      }
    });
  } catch (err) {
    console.error('Ошибка при отправке /start:', err);
  }
});

// На всякий случай игнор других команд/текста (у нас только /start)
bot.on('message', (msg) => {
  const isCommand = typeof msg.text === 'string' && msg.text.startsWith('/');
  if (isCommand && !/^\/start(?:@[\w_]+)?$/.test(msg.text)) {
    bot.sendMessage(
      msg.chat.id,
      'Доступна только команда /start. Нажми /start, чтобы открыть меню.',
      { disable_web_page_preview: true }
    ).catch(() => {});
  }
});

// --- EXPRESS-СЕРВЕР ДЛЯ RENDER ---
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (_req, res) => {
  res.send('IceMind бот работает!');
});

app.get('/healthz', (_req, res) => res.status(200).send('ok'));

app.listen(PORT, () => {
  console.log(`🌐 HTTP-сервер запущен на порту ${PORT}`);
});

// Логи ошибок polling (не критично)
bot.on('polling_error', (err) => {
  console.warn('Polling error:', err?.message || err);
});
