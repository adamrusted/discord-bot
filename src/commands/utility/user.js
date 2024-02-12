const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("welcome")
    .setNameLocalizations({
      "es-ES": "recibir",
      fr: "accueillir",
      it: "benvenuto",
      ja: "いらっしゃいませ",
      ko: "환영하다",
      "pt-BR": "saudar",
      uk: "вітання",
      "zh-CN": "欢迎",
      "zh-TW": "歡迎",
    })
    .setDescription("Welcome a user to the server!")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers) // Changed from 'Administrator' to 'BanMembers' to allow moderator roles to welcome.
    .addUserOption((option) =>
      option
        .setName("user")
        .setNameLocalizations({
          "es-ES": "usuario",
          fr: "utilisateur",
          it: "utente",
          ja: "ユーザー",
          ko: "사용자",
          "pt-BR": "usuário",
          uk: "користувач",
          "zh-CN": "用户",
          "zh-TW": "使用者",
        })
        .setRequired(true)
        .setDescription("The user you are welcoming to the server")
    ),
  async execute(interaction) {
    const target = interaction.options.getUser("user");
    if (!!process.env.VERIFY_CHANNEL) {
      await interaction.reply(
        `Welcome, <@${target.id}> 👋\n\nSee <#${process.env.VERIFY_CHANNEL}> for instructions on how to gain access to all channels here.`
      );
    }
    await interaction.reply(`Welcome, <@${target.id}> 👋`);
  },
};
