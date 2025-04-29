
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Ganti dengan token bot Telegram kamu
const telegramToken = process.env.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;
const bot = new TelegramBot(telegramToken, { polling: true });

// Ganti dengan Hugging Face API token kamu
const HF_TOKEN = process.env.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;

bot.onText(/\/gambar (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const prompt = match[1];

  bot.sendMessage(chatId, `Membuat gambar untuk: "${prompt}"... mohon tunggu.`);

  try {
    const response = await axios({
      method: 'POST',
      url: 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2',
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({ inputs: prompt }),
      responseType: 'arraybuffer'
    });

    // Simpan gambar sementara
    const imagePath = path.join(__dirname, 'result.jpg');
    fs.writeFileSync(imagePath, response.data);

    // Kirim ke Telegram
    bot.sendPhoto(chatId, imagePath, {
      caption: `Berikut hasil gambar dari prompt:\n"${prompt}"`
    });
  } catch (error) {
    console.error(error.message);
    bot.sendMessage(chatId, 'Gagal membuat gambar. Coba lagi nanti atau ganti prompt.');
  }
});
