<h2>Бот для Telegram на Python</h2>
<p>Используем библиотеку python-telegram-bot. Бот будет отвечать на команду /start и /help.</p>

<pre><code>from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("Привет! Я бот.")

app = Application.builder().token("YOUR_TOKEN").build()
app.add_handler(CommandHandler("start", start))
app.run_polling()</code></pre>

<p>Добавьте клавиатуры, обработку сообщений, интеграцию с API.</p>