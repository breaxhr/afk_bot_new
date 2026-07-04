const express = require('express');

const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
    res.send('WelcomeBot is running!');
});

app.listen(PORT, () => {
    console.log(`Web server running on port ${PORT}`);
});
const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');

function createBot() {
    const bot = mineflayer.createBot({
        host: 'thestrongestserver.play.hosting',
        username: 'WelcomeBot'
    });

    bot.loadPlugin(pathfinder);

    bot.once('spawn', () => {
        console.log(`✅ ${bot.username} joined!`);

        const mcData = require('minecraft-data')(bot.version);
        const defaultMove = new Movements(bot, mcData);
        bot.pathfinder.setMovements(defaultMove);

        setInterval(() => {
            if (!bot.entity) return;
            if (bot.pathfinder.isMoving()) return;

            const x = bot.entity.position.x + (Math.random() * 6 - 3);
            const z = bot.entity.position.z + (Math.random() * 6 - 3);
            const y = Math.floor(bot.entity.position.y);

            bot.pathfinder.setGoal(new goals.GoalBlock(
                Math.floor(x),
                y,
                Math.floor(z)
            ));
        }, 5000);
    });

    bot.on('playerJoined', (player) => {
        if (player.username === bot.username) return;
        setTimeout(() => bot.chat(`Hi ${player.username}!`), 1000);
    });

    bot.on('entityHurt', (entity) => {
        if (entity !== bot.entity) return;
        bot.setControlState('back', true);
        bot.setControlState('jump', true);
        setTimeout(() => {
            bot.setControlState('back', false);
            bot.setControlState('jump', false);
        }, 300);
    });

    bot.on('end', () => {
        console.log("Disconnected. Reconnecting...");
        setTimeout(createBot, 5000);
    });

    bot.on('error', console.log);
    bot.on('kicked', console.log);
}

createBot();
