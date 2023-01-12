import { config } from "dotenv";
import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import { commands } from "./commands.js";
import { Configuration, OpenAIApi } from "openai";

config();
const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;

const configuration = new Configuration({
  organization: process.env.OPENAI_ORGANIZATION_ID,
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});
client.login(token);

const rest = new REST({
  version: "10",
}).setToken(token);

(async function () {
  await rest.put(Routes.applicationCommands(clientId), {
    body: commands,
  });
})();

let prompt;
client.on("interactionCreate", async (interaction) => {
  try {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName) await interaction.deferReply();

    prompt = interaction.options.get("prompt").value;
    switch (interaction.commandName) {
      case "ask":
        const completionResponse = await openai.createCompletion({
          // Please see documentations for model configuration
          // https://beta.openai.com/docs/models/gpt-3
          // https://beta.openai.com/docs/api-reference/completions/create
          model: "text-davinci-003",
          prompt: prompt,
          max_tokens: 4000,
          temperature: 0.5,
        });

        await interaction.editReply({
          content: `Prompt: **${prompt}**${
            completionResponse.data.choices.at(0).text
          }`,
        });
        break;
      case "draw":
        const generateImageResponse = await openai.createImage({
          // Please see documentations for model configuration
          // https://beta.openai.com/docs/api-reference/images
          prompt: prompt,
          n: 1,
          size: "512x512",
        });

        await interaction.editReply({
          content: `Prompt: **${prompt}**`,
          embeds: [
            {
              color: 0x0267bc,
              image: {
                url: generateImageResponse.data.data.at(0).url,
              },
            },
          ],
        });
    }
  } catch (error) {
    await interaction.editReply({
      content: `Prompt: **${prompt}**\n\n${error.message}`,
    });
  }
});
