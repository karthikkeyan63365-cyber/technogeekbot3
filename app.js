require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const express = require('express');

const bot = new Telegraf(process.env.BOT_TOKEN);
const app = express();

// === Products and Services Data ===
const products = {
  "Back Case Cover": "₹100 – ₹150",
  "Charger": "₹200 – ₹500",
  "Speakers": "₹250 – ₹1000",
  "Headphones": "₹100 – ₹200",
  "Charger Cable": "₹100 – ₹250"
};

const services = {
  "Tempered Glass Change": "₹100–₹450",
  "Battery Change": "₹500–₹1000",
  "Display Change": "₹1000–₹1800",
  "Display Glass Change": "₹500–₹1000",
  "Camera Change": "₹300–₹500"
};

const phoneModels = [
  "Vivo", "Oppo", "Redmi", "Realme", "OnePlus", "iPhone", "Google Pixel"
];

// === Bot Handlers ===
function showMainMenu(ctx) {
  ctx.reply(
    "👋 Welcome to Technogeek Mobile & Accessories Shop!\n\nPlease choose an option:",
    Markup.inlineKeyboard([
      [Markup.button.callback('🛍 Products', 'show_products')],
      [Markup.button.callback('🛠 Services', 'show_services')]
    ])
  );
}

bot.start(showMainMenu);
bot.on('text', showMainMenu);

bot.action('show_products', async (ctx) => {
  await ctx.answerCbQuery();
  const buttons = Object.keys(products).map(name => [
    Markup.button.callback(name, `product_${name}`)
  ]);
  await ctx.editMessageText("🛍 Please select a product:", Markup.inlineKeyboard(buttons));
});

bot.action(/product_(.+)/, async (ctx) => {
  const productName = ctx.match[1];
  const price = products[productName];
  await ctx.answerCbQuery();
  await ctx.reply(`💰 *${productName}* is available for *${price}*`, { parse_mode: 'Markdown' });
  await ctx.reply(`🙏 Thank you for your time. The *${productName}* is available now. Please come and visit our store!`, { parse_mode: 'Markdown' });
});

bot.action('show_services', async (ctx) => {
  await ctx.answerCbQuery();
  const buttons = Object.keys(services).map(name => [
    Markup.button.callback(name, `service_${name}`)
  ]);
  await ctx.editMessageText("🛠 Please select a service:", Markup.inlineKeyboard(buttons));
});

bot.action(/service_(.+)/, async (ctx) => {
  const serviceName = ctx.match[1];
  const buttons = phoneModels.map(model => [
    Markup.button.callback(model, `model_${serviceName}_${model}`)
  ]);
  await ctx.answerCbQuery();
  await ctx.reply(`📱 You selected *${serviceName}*. Now choose your phone model:`, {
    parse_mode: 'Markdown',
    ...Markup.inlineKeyboard(buttons)
  });
});

bot.action(/model_(.+)_(.+)/, async (ctx) => {
  const serviceName = ctx.match[1];
  const model = ctx.match[2];
  const priceRange = services[serviceName];
  await ctx.answerCbQuery();
  await ctx.reply(`💰 *${serviceName}* for *${model}* is estimated at *${priceRange}*`, { parse_mode: 'Markdown' });
  await ctx.reply(`🙏 Thank you for your time. *${serviceName}* for *${model}* is available now. Please come and visit our store!`, { parse_mode: 'Markdown' });
});

// === Webhook Setup for Render ===
app.use(bot.webhookCallback('/webhook'));

// Just a test page to confirm Render is live
app.get('/', (req, res) => {
  res.send("🤖 Technogeek Bot is running...");
});

// === Start Server and Set Webhook ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  const webhookUrl = 'https://technogeekbot3.onrender.com/webhook'; // Replace with your actual Render service URL
  await bot.telegram.setWebhook(webhookUrl);
  console.log(`✅ Webhook set to ${webhookUrl}`);
});
