import DiscordJS, { Intents } from 'discord.js';
import dotenv from 'dotenv';
import fs from 'fs';
import {filterObjects, filterOnKeys, stringfyCleanUp, createMessageEmbed} from './requestHandlers'
import {getRandomIntInclusive} from './randomNumber'

dotenv.config()


const animeData = JSON.parse(fs.readFileSync('./data/springAnimes', 'utf8'));
//console.log(animeData[0])

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
})

client.on('ready', () => {
    console.log('The bot is ready')
    const guildId = '706350198292480071';
    const guild = client.guilds.cache.get(guildId);

    let commands

    if (guild) {
        commands = guild.commands;
    }else {
        commands = client.application?.commands;
    }

    commands?.create({
        name: "pick",
        description: "Chooses a random anime."
    })

    commands?.create({
        name:'find',
        description: "Finds an anime by name.",
        options: [
            {
                name: 'anime',
                description: "Anime to look for.",
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
                required: true
            }
        ]
    })
    commands?.create({
        name:'genre',
        description: "Finds any anime by genre.",
        options: [
            {
                name: 'genre',
                description: "Anime to look for by genre.",
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
                required: true
            }
        ]
    })
    
})

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;
    let stringThemes;
    let stringStudios;
    let stringGenres;
    let anime;
    let match;
    let embed;
    let warning;
    switch (commandName) {
        case 'pick': 
            try {
                const num = getRandomIntInclusive(0, animeData.length-1);
                anime = animeData[num];
                //console.log(anime?.title?.common);
                stringThemes = stringfyCleanUp(JSON.stringify(anime?.data?.information?.themes ? anime?.data?.information?.themes : "N/A" ));
                stringStudios = stringfyCleanUp(JSON.stringify(anime?.data?.information?.studios ? anime?.data?.information?.studios : "N/A" ));
                stringGenres = stringfyCleanUp(JSON.stringify(anime?.data?.information?.genres ? anime?.data?.information?.genres : "N/A" ));
                embed = createMessageEmbed(anime);    
                embed.addField("Studios", stringStudios || "N/A", false);
                embed.addField("Themes", stringThemes || "N/A", false);
                embed.addField("Genres", stringGenres || "N/A", false);
                interaction.reply({
                    embeds: [embed],
                    ephemeral: true,        
                });
            }catch {
                console.log('Could not find random anime');
            }
            
            break;
        case 'find': 
            try {
                match = animeData.filter((obj: any) => {
                    const [first] = filterObjects(options.getString('anime'), obj, obj, []);
                    return first;
                })
                
                anime = match[0];
                console.log(anime);
                stringThemes = stringfyCleanUp(JSON.stringify(anime?.data?.information?.themes ? anime?.data?.information?.themes : "N/A" ));
                stringStudios = stringfyCleanUp(JSON.stringify(anime?.data?.information?.studios ? anime?.data?.information?.studios : "N/A" ));
                stringGenres = stringfyCleanUp(JSON.stringify(anime?.data?.information?.genres ? anime?.data?.information?.genres : "N/A" ));
                embed = createMessageEmbed(anime);
                embed.addField("Studios", stringStudios || "N/A", false);
                embed.addField("Themes", stringThemes || "N/A", false);
                embed.addField("Genres", stringGenres || "N/A", false);
                interaction.reply({
                    embeds: [embed],
                    ephemeral: true,
                });
            }catch{
                warning = 'No new anime exist.'
                interaction.reply({
                    content: warning,
                    ephemeral: true,
                })
            }
            break;
        case 'genre':
            try{
                match  = filterOnKeys(options.getString('genre'), animeData);
                anime = match[getRandomIntInclusive(0, match.length-1)];
                stringStudios = stringfyCleanUp(JSON.stringify(anime?.data?.information?.studios ? anime?.data?.information?.studios : "N/A" ));
                stringThemes = stringfyCleanUp(JSON.stringify(anime?.data?.information?.themes ? anime?.data?.information?.themes : "N/A" ));
                stringGenres = stringfyCleanUp(JSON.stringify(anime?.data?.information?.genres ? anime?.data?.information?.genres : "N/A" ));
                embed = createMessageEmbed(anime);
                embed.addField("Studios", stringStudios || "N/A", false);
                embed.addField("Themes", stringThemes || "N/A", false);
                embed.addField("Genres", stringGenres || "N/A", false);
                interaction.reply({
                    embeds: [embed],
                    ephemeral: true,
                });
            }catch{
                warning = 'No such ' + commandName + ' exist.'
                interaction.reply({
                    content: warning,
                    ephemeral: true,
                })
                console.log('error')
            }
            break;

        default: return;
    }
})


client.login(process.env.TOKEN);