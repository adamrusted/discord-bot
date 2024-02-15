const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('onboard')
        .setDescription('[BETA] Onboard a new maintainer')
        .addUserOption((opt) =>
            opt.setName('person')
            .setDescription('The user you would like to add to the maintainer team')
            .setRequired(true)
        ),
    async execute(interaction) {
        await interaction.reply({ content: 'This is a beta command', ephemeral: true})
        const newMaintainer = await interaction.options.getUser('person')
        await newMaintainer.send('Hey there! Welcome to the **Simple Icons Maintainer** Team!')
    }
}