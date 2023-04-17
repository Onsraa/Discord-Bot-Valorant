const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { maps } = require('./maps.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('map')
		.setDescription('Generate a random map.'),
        /*
        //That part could add options to the command prompt so the bot could choose without a doubt the right custom party the generated map.
        .addStringOption(option =>
            option.setName('category')
                .setDescription('The gif category')
                .setRequired(true)
                .addChoices(
                    { name: generateRandomString(6), value: 'none' },
                    { name: generateRandomString(6), value: 'none' },
                    { name: generateRandomString(6), value: 'none' },
                )),
        */
	async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        //Generate buttons and then add them to the row.
        const rerollButton = createRerollButton();
        const validateButton = validateMapButton();
        const row = new ActionRowBuilder()
            .addComponents(validateButton, rerollButton)

        //Generate a random map.
        const mapEmbed = createMapEmbed();
        
		const response = await interaction.reply({embeds: [mapEmbed], components: [row]});
	}
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
//Will be used later to generate custom's name
function generateRandomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
  
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  
    return result;
  }
*/