import { MessageEmbed } from 'discord.js';


export const createMessageEmbed = (currentAnime:any) => {
    return new MessageEmbed()
        .setTitle(currentAnime?.title?.english || currentAnime?. title?.common)
        .setColor('DARK_BLUE')
        .setImage(currentAnime.image)
        .setURL(currentAnime.url);
}

export const filterObjects = (term:any, obj: any, original: any, store: any) => {
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

export const filterOnKeys = (stringKey:any, animeData: any) => {
    return animeData.filter((e:any) => {
        return e?.data?.information?.genres?.filter((obj:any) => {return obj.name.toLowerCase() === stringKey?.toLowerCase()}).length > 0;
    });
}

export const stringfyCleanUp = (stringfyItem: any) => {
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