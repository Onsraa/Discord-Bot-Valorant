const { SlashCommandBuilder } = require('discord.js');
const { maps } = require('./maps.json');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Generate a random Valorant map'),
    async execute(interaction) {
        const map = maps[Math.floor(Math.random() * maps.length)];
        const embed = new MessageEmbed()
            .setTitle(map.name)
            .setImage(map.image);

        const row = new MessageActionRow().addComponents(
            createRerollButton()
        );

        const message = await interaction.reply({
            content: 'Here is your random Valorant map:',
            embeds: [embed],
            components: [row],
        });

        const collector = interaction.channel.createMessageComponentCollector({
            filter: (i) => i.customId === 'reroll' && i.user.id === interaction.user.id,
            time: 10000,
            max: 1,
        });

        collector.on('collect', async (i) => {
            const newMap = maps[Math.floor(Math.random() * maps.length)];
            const newEmbed = new MessageEmbed()
                .setTitle(newMap.name)
                .setImage(newMap.image);

            row.components[0] = createRerollButton();

            await i.update({
                content: 'Here is your new random Valorant map:',
                embeds: [newEmbed],
                components: [row],
            });
        });

        collector.on('end', async (collected) => {
            if (collected.size === 0) {
                row.components[0] = createDisabledRerollButton();
                await message.edit({ components: [row] });
            }
        });
    },
};

function createRerollButton() {
    return new MessageButton()
        .setCustomId('reroll')
        .setLabel('Reroll')
        .setStyle('PRIMARY');
}

function createDisabledRerollButton() {
    return new MessageButton()
        .setCustomId('reroll')
        .setLabel('Reroll')
        .setStyle('PRIMARY')
        .setDisabled(true);
}
