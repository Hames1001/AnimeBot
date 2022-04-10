import { SlashCommandBuilder } from '@discordjs/builders';
import DiscordJS, { Intents, MessageEmbed  } from 'discord.js';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config()


const animeData = JSON.parse(fs.readFileSync('./springAnimes', 'utf8'));
//console.log(animeData[0])


function getRandomIntInclusive(min:number, max:number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}
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
        description: "Finds an Anime.",
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
        description: "Finds an Anime by genre.",
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

const stringfyCleanUp = (stringfyItem: any) => {
    let newVar = stringfyItem.replace(/(name)*(url)*([["{}:\]])/g, "");
    console.log(newVar);
    let array = newVar.split(',');
    let concatString: any = [];
    array.forEach((e: string, i: any) => {
        if (i % 2 === 0) {
            let str = "`" + e.slice(0, e.length) + "`";
            concatString.push(str);
        }
    })
    return concatString.join(" ");
}
const filterObjects = (term:any, obj: any, original: any, store: any) => {
    const data = store;
    if (typeof obj === "object" && obj) {
        console.log(Object.values(obj));
        Object.values(obj).map((value) => {
        if (typeof value === "object") {
            filterObjects(term,value, original, data);
        } else if (("" + value).toLowerCase().replace(/\s+/g, "").includes(term.toLowerCase().replace(/\s+/g, ""))  && value) {
            data.push(original);
        }
    });
    } else if (("" + obj).toLowerCase().replace(/\s+/g, "").includes(term.toLowerCase().replace(/\s+/g, "")) && obj) {
        data.push(original);
    }
    return data;
};

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;
    let stringThemes;
    let stringStudios;
    let stringGenres;
    let anime;
    let match;
    switch (commandName) {
        case 'pick': 
            const num = getRandomIntInclusive(0, animeData.length-1);
            anime = animeData[num];
            //console.log(anime?.title?.common);
            stringThemes = stringfyCleanUp(JSON.stringify(anime?.data?.information?.themes ? anime?.data?.information?.themes : "N/A" ));
            stringStudios = stringfyCleanUp(JSON.stringify(anime?.data?.information?.studios ? anime?.data?.information?.studios : "N/A" ));
            stringGenres = stringfyCleanUp(JSON.stringify(anime?.data?.information?.genres ? anime?.data?.information?.genres : "N/A" ));
            const embed1 = new MessageEmbed()
                .setTitle(anime?.title?.english || anime?.title?.common)
                .setColor('DARK_VIVID_PINK')
                .setImage(anime.image)
                .setURL(anime.url)
            
            embed1.addField("Studios", stringStudios || "N/A", false);
            embed1.addField("Themes", stringThemes || "N/A", false);
            embed1.addField("Genres", stringGenres || "N/A", false);

            interaction.reply({
                embeds: [embed1],
                ephemeral: false,        
            });
            break;
        case 'find': 
            match = animeData.filter((obj: any) => {
                const [first] = filterObjects(options.getString('anime'), obj, obj, []);
                return first;
            })
            
            anime = match[0];
            console.log(anime);
            stringThemes = stringfyCleanUp(JSON.stringify(anime?.data?.information?.themes ? anime?.data?.information?.themes : "N/A" ));
            stringStudios = stringfyCleanUp(JSON.stringify(anime?.data?.information?.studios ? anime?.data?.information?.studios : "N/A" ));
            stringGenres = stringfyCleanUp(JSON.stringify(anime?.data?.information?.genres ? anime?.data?.information?.genres : "N/A" ));
            const embed2 = new MessageEmbed()
                .setTitle(anime?.title?.english || anime?. title?.common)
                .setColor('DARK_BLUE')
                .setImage(anime.image)
                .setURL(anime.url);
            embed2.addField("Studios", stringStudios || "N/A", false);
            embed2.addField("Themes", stringThemes || "N/A", false);
            embed2.addField("Genres", stringGenres || "N/A", false);
            interaction.reply({
                embeds: [embed2],
                ephemeral: false,
            });
            break;
        case 'genre':
            match  = animeData.filter((e:any) => {
                let matchGenre = options.getString('genre');
                return e?.data?.information?.genres?.filter((obj:any) => {return obj.name.toLowerCase() === matchGenre?.toLowerCase()}).length > 0;
            });
            console.log(match.length)
            const currentAnime = match[getRandomIntInclusive(0, match.length-1)];
            console.log(currentAnime);
            stringThemes = stringfyCleanUp(JSON.stringify(currentAnime?.data?.information?.themes ? currentAnime?.data?.information?.themes : "N/A" ));
            stringStudios = stringfyCleanUp(JSON.stringify(currentAnime?.data?.information?.studios ? currentAnime?.data?.information?.studios : "N/A" ));
            stringGenres = stringfyCleanUp(JSON.stringify(currentAnime?.data?.information?.genres ? currentAnime?.data?.information?.genres : "N/A" ));
            const embed3 = new MessageEmbed()
                .setTitle(currentAnime?.title?.english || currentAnime?. title?.common)
                .setColor('DARK_BLUE')
                .setImage(currentAnime.image)
                .setURL(currentAnime.url);
            embed3.addField("Studios", stringStudios || "N/A", false);
            embed3.addField("Themes", stringThemes || "N/A", false);
            embed3.addField("Genres", stringGenres || "N/A", false);
            interaction.reply({
                embeds: [embed3],
                ephemeral: false,
            });
            break;

        default: return;
    }
})


client.login(process.env.TOKEN);