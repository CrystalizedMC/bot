const { Client, GatewayIntentBits } = require('discord.js');
const puppeteer = require('puppeteer');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', () => {
    console.log('Bot is ready!');
});

client.on('messageCreate', async message => {
    if (message.content.startsWith('!search ')) {
        const query = message.content.slice(8);
        const searchURL = `https://www.google.com/search?q=${query}`;

        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(searchURL);

            const result = await page.evaluate(() => {
                const results = document.querySelectorAll('.g a');
                return results.length > 0 ? results[0].href : 'No results found.';
            });

            await browser.close();
            message.channel.send(result);
        } catch (error) {
            console.error(error);
            message.channel.send('An error occurred while searching.');
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
