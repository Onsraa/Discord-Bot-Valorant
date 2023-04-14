const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { maps } = require('./maps.json');

module.exports = {
    cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('map')
		.setDescription('Generate a random map.'),
	async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        let tmp_maps = maps;

        const rerollButton = createRerollButton();
        const validateButton = validateMapButton();
        const row = new ActionRowBuilder()
            .addComponents(validateButton, rerollButton)

        const mapEmbed = createMapEmbed();

		const response = await interaction.reply({embeds: [mapEmbed], components: [row]});

        const filter = i => i.user.id === interaction.user.id;
        try {
            const confirmation = await response.awaitMessageComponent({ filter, time: 10000 });
            if(confirmation.customId === 'validate'){
                await i.update({content : 'It\'s validate !', components: []});
            }else if (confirmation.customId === 'reroll'){
                await i.update({content : 'Reroll !', components: []});
            }
        } catch (e) {
            await response.editReply({ content: 'Confirmation not received within 10 seconds, cancelling', components: [] });
        }
	},
};

function createMapEmbed(){

    const map = maps[Math.floor(Math.random() * maps.length)];

    return new EmbedBuilder()
			.setColor(0x296DE3)
            .setTitle(map.name)
            .setImage(map.image);
}

function createRerollButton() {
    return new ButtonBuilder()
            .setCustomId('reroll')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('✖️')
    
}

function validateMapButton(){
    return new ButtonBuilder()
            .setCustomId('validate')
            .setStyle(ButtonStyle.Success)
            .setEmoji('✔️')
}

/*

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

        collector.on('collect', async i => {
            if (i instanceof ButtonInteraction) {
                await i.deferUpdate();

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
            }
        });
    },
    */