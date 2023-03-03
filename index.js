import { IntentsBitField, Client, ActivityType, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js"
import axios from "axios"
import config from "./config.json" assert { type: "json" }
import { createPaste } from "dpaste-ts"
const allIntents = new IntentsBitField(3276799)
const client = new Client({ intents: allIntents })
let runcodes = 0
let runtimes = await axios.get("https://emkc.org/api/v2/piston/runtimes").then(response => Array.from(response.data))
client.on("ready", () => {
    console.clear()
    client.user.setPresence({
        activities: [{ name: `I executed ${runcodes} codes since I am online (updates every 3 minutes)`, type: ActivityType.Watching }],
    })
    setInterval(() => {
        client.user.setPresence({
            activities: [{ name: `I executed ${runcodes} codes since I am online (updates every 3 minutes)`, type: ActivityType.Watching }],
        })
    }, 210000)
    let commands = client.application?.commands
    commands?.create({
        name: "run",
        description: "Run a code (Piston API)"
    })
    commands?.create({
        name: "languages",
        description: "Show supported programming languages",
    })
    commands?.create({
        name: "invite",
        description: "Get the bot invite link",
    })
    console.log("Ready")
})
client.on("messageCreate", async (msg) => {
    if (msg.content.startsWith(">eval")) {
        let code = msg.content.slice(6)
        if (!code) {
            return msg.channel.send("❌ Provide a code to evaluate it")
        }
        if (msg.author.id != "604339998312890379") {
            return msg.channel.send("❌ You can't do this")
        }
        else {
            try {
                let codeval = eval(code)
                let evalembed = new EmbedBuilder()
                    .setColor("#607387")
                    .setTitle("Evaluation Result")
                    .addFields(
                        { name: "Input", value: "```js" + "\n" + code + "\n" + "```", inline: false },
                        { name: "Output", value: "```js" + "\n" + codeval + "\n" + "```", inline: false })
                await msg.channel.send({ embeds: [evalembed] })
            }
            catch (error) {
                let evalerrorembed = new EmbedBuilder()
                    .setColor("#607387")
                    .setTitle("Evaluation Result")
                    .addFields(
                        { name: "Input", value: "```js" + "\n" + code + "\n" + "```", inline: false },
                        { name: "Output", value: "```js" + "\n" + error + "\n" + "```", inline: false })
                await msg.channel.send({ embeds: [evalerrorembed] })
            }
        }
    }
})
client.on("interactionCreate", /** @param { import("discord.js").ChatInputCommandInteraction } i */ async (i) => {
    if (i.commandName === "run") {
        let modal = new ModalBuilder()
            .setCustomId("run")
            .setTitle("Run Code")
        let language = new TextInputBuilder()
            .setCustomId("language")
            .setLabel("Language")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setMinLength(1)
            .setMaxLength(10)
        let code = new TextInputBuilder()
            .setCustomId("code")
            .setLabel("Code")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)
            .setMinLength(5)
        let input = new TextInputBuilder()
            .setCustomId("input")
            .setLabel("Input")
            .setStyle(TextInputStyle.Short)
            .setRequired(false)
            .setPlaceholder("(optional)")
        let firstrow = new ActionRowBuilder()
            .addComponents(language)
        let secondrow = new ActionRowBuilder()
            .addComponents(code)
        let thirdrow = new ActionRowBuilder()
            .addComponents(input)
        modal.addComponents(firstrow, secondrow, thirdrow)
        await i.showModal(modal)
    }
    else if (i.commandName === "languages") {
        let languages = []
        for (let c = 0; c < runtimes.length; c++) {
            languages.push({ name: `Language: ${runtimes[c].language}`, value: `Version: ${runtimes[c].version}`, inline: true })
        }
        let languagesembed = new EmbedBuilder()
            .setColor("#607387")
            .setAuthor({ name: i.user.username, iconURL: i.user.avatarURL() })
            .setTitle("Supported Languages")
            .setDescription(`Total languages: ${runtimes.length}`)
            .addFields(languages.slice(0, 25))
        let previous = new ButtonBuilder()
            .setCustomId("previous1")
            .setLabel("Previous")
            .setDisabled(true)
            .setStyle(ButtonStyle.Primary)
        let next = new ButtonBuilder()
            .setCustomId("next1")
            .setLabel("Next")
            .setStyle(ButtonStyle.Primary)
        let row = new ActionRowBuilder()
            .addComponents(previous, next)
        await i.reply({ embeds: [languagesembed], components: [row], ephemeral: true })
    }
    else if (i.commandName === "invite") {
        let invite = new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setLabel("Invite")
            .setURL("https://discord.com/api/oauth2/authorize?client_id=1076200668810985634&permissions=274877975552&scope=applications.commands%20bot")
        let row = new ActionRowBuilder()
            .addComponents(invite)
        await i.reply({ components: [row], ephemeral: true })
    }
})
client.on("interactionCreate", /** @param { import("discord.js").ButtonInteraction } i */ async (i) => {
    if (!i.isButton()) return
    else if (i.customId === "next1") {
        let languages = []
        for (let c = 0; c < runtimes.length; c++) {
            languages.push({ name: `Language: ${runtimes[c].language}`, value: `Version: ${runtimes[c].version}`, inline: true })
        }
        let languagesembed = new EmbedBuilder()
            .setColor("#607387")
            .setAuthor({ name: i.user.username, iconURL: i.user.avatarURL() })
            .setTitle("Supported Languages")
            .setDescription(`Total languages: ${runtimes.length}`)
            .addFields(languages.slice(25, 50))
        let previous = new ButtonBuilder()
            .setCustomId("previous2")
            .setLabel("Previous")
            .setStyle(ButtonStyle.Primary)
        let next = new ButtonBuilder()
            .setCustomId("next2")
            .setLabel("Next")
            .setStyle(ButtonStyle.Primary)
        let row = new ActionRowBuilder()
            .addComponents(previous, next)
        await i.update({ embeds: [languagesembed], components: [row] })
    }
    else if (i.customId === "next2") {
        let languages = []
        for (let c = 0; c < runtimes.length; c++) {
            languages.push({ name: `Language: ${runtimes[c].language}`, value: `Version: ${runtimes[c].version}`, inline: true })
        }
        let languagesembed = new EmbedBuilder()
            .setColor("#607387")
            .setAuthor({ name: i.user.username, iconURL: i.user.avatarURL() })
            .setTitle("Supported Languages")
            .setDescription(`Total languages: ${runtimes.length}`)
            .addFields(languages.slice(50, 75))
        let previous = new ButtonBuilder()
            .setCustomId("previous3")
            .setLabel("Previous")
            .setStyle(ButtonStyle.Primary)
        let next = new ButtonBuilder()
            .setCustomId("next3")
            .setLabel("Next")
            .setStyle(ButtonStyle.Primary)
        let row = new ActionRowBuilder()
            .addComponents(previous, next)
        await i.update({ embeds: [languagesembed], components: [row], ephemeral: true })
    }
    else if (i.customId === "previous2") {
        let languages = []
        for (let c = 0; c < runtimes.length; c++) {
            languages.push({ name: `Language: ${runtimes[c].language}`, value: `Version: ${runtimes[c].version}`, inline: true })
        }
        let languagesembed = new EmbedBuilder()
            .setColor("#607387")
            .setAuthor({ name: i.user.username, iconURL: i.user.avatarURL() })
            .setTitle("Supported Languages")
            .setDescription(`Total languages: ${runtimes.length}`)
            .addFields(languages.slice(0, 25))
        let previous = new ButtonBuilder()
            .setCustomId("previous1")
            .setLabel("Previous")
            .setDisabled(true)
            .setStyle(ButtonStyle.Primary)
        let next = new ButtonBuilder()
            .setCustomId("next1")
            .setLabel("Next")
            .setStyle(ButtonStyle.Primary)
        let row = new ActionRowBuilder()
            .addComponents(previous, next)
        await i.update({ embeds: [languagesembed], components: [row], ephemeral: true })
    }
    else if (i.customId === "next3") {
        let languages = []
        for (let c = 0; c < runtimes.length; c++) {
            languages.push({ name: `Language: ${runtimes[c].language}`, value: `Version: ${runtimes[c].version}`, inline: true })
        }
        let languagesembed = new EmbedBuilder()
            .setColor("#607387")
            .setAuthor({ name: i.user.username, iconURL: i.user.avatarURL() })
            .setTitle("Supported Languages")
            .setDescription(`Total languages: ${runtimes.length}`)
            .addFields(languages.slice(75))
        let previous = new ButtonBuilder()
            .setCustomId("previous4")
            .setLabel("Previous")
            .setStyle(ButtonStyle.Primary)
        let next = new ButtonBuilder()
            .setCustomId("next4")
            .setLabel("Next")
            .setDisabled(true)
            .setStyle(ButtonStyle.Primary)
        let row = new ActionRowBuilder()
            .addComponents(previous, next)
        await i.update({ embeds: [languagesembed], components: [row], ephemeral: true })
    }
    else if (i.customId === "previous3") {
        let languages = []
        for (let c = 0; c < runtimes.length; c++) {
            languages.push({ name: `Language: ${runtimes[c].language}`, value: `Version: ${runtimes[c].version}`, inline: true })
        }
        let languagesembed = new EmbedBuilder()
            .setColor("#607387")
            .setAuthor({ name: i.user.username, iconURL: i.user.avatarURL() })
            .setTitle("Supported Languages")
            .setDescription(`Total languages: ${runtimes.length}`)
            .addFields(languages.slice(25, 50))
        let previous = new ButtonBuilder()
            .setCustomId("previous2")
            .setLabel("Previous")
            .setStyle(ButtonStyle.Primary)
        let next = new ButtonBuilder()
            .setCustomId("next2")
            .setLabel("Next")
            .setStyle(ButtonStyle.Primary)
        let row = new ActionRowBuilder()
            .addComponents(previous, next)
        await i.update({ embeds: [languagesembed], components: [row], ephemeral: true })
    }
    else if (i.customId === "previous4") {
        let languages = []
        for (let c = 0; c < runtimes.length; c++) {
            languages.push({ name: `Language: ${runtimes[c].language}`, value: `Version: ${runtimes[c].version}`, inline: true })
        }
        let languagesembed = new EmbedBuilder()
            .setColor("#607387")
            .setAuthor({ name: i.user.username, iconURL: i.user.avatarURL() })
            .setTitle("Supported Languages")
            .setDescription(`Total languages: ${runtimes.length}`)
            .addFields(languages.slice(50, 75))
        let previous = new ButtonBuilder()
            .setCustomId("previous3")
            .setLabel("Previous")
            .setStyle(ButtonStyle.Primary)
        let next = new ButtonBuilder()
            .setCustomId("next3")
            .setLabel("Next")
            .setStyle(ButtonStyle.Primary)
        let row = new ActionRowBuilder()
            .addComponents(previous, next)
        await i.update({ embeds: [languagesembed], components: [row], ephemeral: true })
    }
    else if (i.customId.startsWith("delete")) {
        if (i.user != i.customId.split(" - ")[1]) return i.reply({ content: "❌ You can't do this", ephemeral: true })
        await i.message.delete()
    }
    else if (i.customId.startsWith("edit")) {
        if (i.user != i.customId.split(" - ")[1]) return i.reply({ content: "❌ You can't do this", ephemeral: true })
        let modal = new ModalBuilder()
            .setCustomId("runedit")
            .setTitle("Run Code")
        let language = new TextInputBuilder()
            .setCustomId("language")
            .setLabel("Language")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setMinLength(1)
            .setMaxLength(10)
        let code = new TextInputBuilder()
            .setCustomId("code")
            .setLabel("Code")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)
            .setMinLength(5)
        let input = new TextInputBuilder()
            .setCustomId("input")
            .setLabel("Input")
            .setStyle(TextInputStyle.Short)
            .setRequired(false)
            .setPlaceholder("(optional)")
        let firstrow = new ActionRowBuilder()
            .addComponents(language)
        let secondrow = new ActionRowBuilder()
            .addComponents(code)
        let thirdrow = new ActionRowBuilder()
            .addComponents(input)
        modal.addComponents(firstrow, secondrow, thirdrow)
        await i.showModal(modal)
    }
})
client.on("interactionCreate", /** @param { import("discord.js").ModalSubmitInteraction } i */ async (i) => {
    if (!i.isModalSubmit()) return
    else if (i.customId === "run") {
        let language = i.fields.getTextInputValue("language").toLowerCase()
        let code = i.fields.getTextInputValue("code")
        let input = "" || i.fields.getTextInputValue("input")
        let version
        for (let i = 0; i < runtimes.length; i++) {
            if (runtimes[i].aliases.length != 0) {
                for (let c = 0; c < runtimes[i].aliases.length; c++) {
                    if (language == runtimes[i].language || language == runtimes[i].aliases[c]) {
                        language = runtimes[i].language
                        version = runtimes[i].version
                    }
                }
            }
            else {
                if (language == runtimes[i].language) {
                    language = runtimes[i].language
                    version = runtimes[i].version
                }
            }
        }
        if (version == undefined) {
            return i.reply({ content: "Unknown Language!", ephemeral: true })
        }
        await i.deferReply()
        if (language == "go") {
            if (code.includes("func main() {")) return
            else {
                code = "package main" + "\n" + "import \"fmt\"" + "\n" + "func main() {" + "\n" + "  " + code.replace("\n", "\n  ") + "\n" + "}"
            }
        }
        else if (language == "rust") {
            if (code.includes("fn main() {")) return
            else {
                code = "use std::io;" + "\n" + "fn main() {" + "\n" + "  " + code.replace("\n", "\n  ") + "\n" + "}"
            }
        }
        else if (language == "c") {
            if (code.includes("int main() {")) return
            else {
                code = "#include <stdio.h>" + "\n" + "int main() {" + "\n" + "  " + code.replace("\n", "\n  ") + "\n" + "}"
            }
        }
        else if (language == "c++") {
            if (code.includes("int main() {")) return
            else {
                code = "#include <iostream>" + "\n" + "using namespace std;" + "\n" + "int main() {" + "\n" + "  " + code.replace("\n", "\n  ") + "\n" + "}"
            }
        }
        else if (language == "csharp.net") {
            if (code.includes("static void Main(string[] args) {")) return
            else {
                code = "using System;" + "\n" + "class Program {" + "\n" + "  static void Main(string[] args) {" + "\n" + "    " + code.replace("\n", "\n    ") + "\n" + "  }" + "\n" + "}"
            }
        }
        else if (language == "java") {
            if (code.includes("public static void Main(string[] args) {")) return
            else {
                code = "public class Main {" + "\n" + "  public static void main(String[] args) {" + "\n" + "    " + code.replace("\n", "\n    ") + "\n" + "  }" + "\n" + "}"
            }
        }
        else if (language == "kotlin") {
            if (code.includes("fun main() {")) return
            else {
                code = "fun main() {" + "\n" + "  " + code.replace("\n", "\n  ") + "\n" + "}"
            }
        }
        let result = await axios.post("https://emkc.org/api/v2/piston/execute", {
            "language": language,
            "version": "*",
            "files": [{
                "content": code
            }],
            "stdin": input,
            "args": [input]
        })
        result = result.data
        try {
            let runembed = new EmbedBuilder()
                .setColor("#607387")
                .setAuthor({ name: i.user.username, iconURL: i.user.avatarURL() })
                .setTitle("Evaluation Result")
                .addFields(
                    { name: "Language", value: "```" + "\n" + language + "\n" + "```", inline: false },
                    { name: "Version", value: "```" + "\n" + version + "\n" + "```", inline: false },
                    { name: "Input code", value: "```" + language + "\n" + code.slice(0, 925) + "\n" + "```", inline: false },
                    { name: "Output", value: "```" + language + "\n" + result.run.output.slice(0, 925) + "\n" + "```", inline: false })
            let cancel = new ButtonBuilder()
                .setCustomId(`delete - ${i.user.id}`)
                .setLabel("Delete")
                .setStyle(ButtonStyle.Danger)
            let edit = new ButtonBuilder()
                .setCustomId(`edit - ${i.user.id}`)
                .setLabel("Edit")
                .setStyle(ButtonStyle.Primary)
            let row = new ActionRowBuilder()
                .addComponents(edit, cancel)
            if (input) {
                runembed.addFields({ name: "Input from user", value: "```" + "\n" + input + "\n" + "```", inline: false })
            }
            if (code.length > 925) {
                runembed.setFields(
                    { name: "Language", value: "```" + "\n" + language + "\n" + "```", inline: false },
                    { name: "Version", value: "```" + "\n" + version + "\n" + "```", inline: false },
                    { name: "Input", value: "```" + language + "\n" + code.slice(0, 925) + "\n" + "```" + "**__TOO LONG__**", inline: false },
                    { name: "Output", value: "```" + language + "\n" + result.run.output.slice(0, 925) + "\n" + "```", inline: false })
            }
            if (result.run.output.length > 925) {
                let url = await createPaste({
                    content: result.run.output,
                    expiry_days: 365
                })
                runembed.setFields(
                    { name: "Language", value: "```" + "\n" + language + "\n" + "```", inline: false },
                    { name: "Version", value: "```" + "\n" + version + "\n" + "```", inline: false },
                    { name: "Input", value: "```" + language + "\n" + code.slice(0, 925) + "\n" + "```", inline: false },
                    { name: "Output", value: "```" + language + "\n" + result.run.output.slice(0, 925) + "\n" + "```" + "**__TOO LONG__**" + "\n" + `wiew entire output [here](${url})`, inline: false })
            }
            if (code.length > 925 && result.run.output.length > 925) {
                let url = await createPaste({
                    content: result.run.output,
                    expiry_days: 365
                })
                runembed.setFields(
                    { name: "Language", value: "```" + "\n" + language + "\n" + "```", inline: false },
                    { name: "Version", value: "```" + "\n" + version + "\n" + "```", inline: false },
                    { name: "Input", value: "```" + language + "\n" + code.slice(0, 925) + "\n" + "```" + "**__TOO LONG__**", inline: false },
                    { name: "Output", value: "```" + language + "\n" + result.run.output.slice(0, 925) + "\n" + "```" + "**__TOO LONG__**" + "\n" + `wiew entire output [here](${url})`, inline: false })
            }
            if (result.run.output.length == 0 || result.run.output == "\n") {
                runembed.setFields(
                    { name: "Language", value: "```" + "\n" + language + "\n" + "```", inline: false },
                    { name: "Version", value: "```" + "\n" + version + "\n" + "```", inline: false },
                    { name: "Input", value: "```" + language + "\n" + code.slice(0, 925) + "\n" + "```", inline: false },
                    { name: "Output", value: "No output!", inline: false })
            }
            await i.followUp({ embeds: [runembed], components: [row] })
            runcodes += 1
        }
        catch (error) {
            let errorembed = new EmbedBuilder()
                .setColor("#607387")
                .setAuthor({ name: i.user.username, iconURL: i.user.avatarURL() })
                .setTitle("Evaluation Result")
                .setDescription("There was an error!")
                .addFields(
                    { name: "Error", value: "```" + "\n" + error + "\n" + "```", inline: false })
            let cancel = new ButtonBuilder()
                .setCustomId(`delete - ${i.user.id}`)
                .setLabel("Delete")
                .setStyle(ButtonStyle.Danger)
            let edit = new ButtonBuilder()
                .setCustomId(`edit - ${i.user.id}`)
                .setLabel("Edit")
                .setStyle(ButtonStyle.Primary)
            let row = new ActionRowBuilder()
                .addComponents(edit, cancel)
            await i.followUp({ embeds: [errorembed], components: [row] })
            console.log(error)
            runcodes += 1
        }
    }
    else if (i.customId === "runedit") {
        let language = i.fields.getTextInputValue("language").toLowerCase()
        let code = i.fields.getTextInputValue("code")
        let input = "" || i.fields.getTextInputValue("input")
        let version
        for (let i = 0; i < runtimes.length; i++) {
            if (runtimes[i].aliases.length != 0) {
                for (let c = 0; c < runtimes[i].aliases.length; c++) {
                    if (language == runtimes[i].language || language == runtimes[i].aliases[c]) {
                        language = runtimes[i].language
                        version = runtimes[i].version
                    }
                }
            }
            else {
                if (language == runtimes[i].language) {
                    language = runtimes[i].language
                    version = runtimes[i].version
                }
            }
        }
        if (version == undefined) {
            return i.reply({ content: "Unknown Language!", ephemeral: true })
        }
        await i.deferUpdate()
        if (language == "go") {
            if (code.includes("func main() {")) return
            else {
                code = "package main" + "\n" + "import \"fmt\"" + "\n" + "func main() {" + "\n" + "  " + code.replace("\n", "\n  ") + "\n" + "}"
            }
        }
        else if (language == "rust") {
            if (code.includes("fn main() {")) return
            else {
                code = "use std::io;" + "\n" + "fn main() {" + "\n" + "  " + code.replace("\n", "\n  ") + "\n" + "}"
            }
        }
        else if (language == "c") {
            if (code.includes("int main() {")) return
            else {
                code = "#include <stdio.h>" + "\n" + "int main() {" + "\n" + "  " + code.replace("\n", "\n  ") + "\n" + "}"
            }
        }
        else if (language == "c++") {
            if (code.includes("int main() {")) return
            else {
                code = "#include <iostream>" + "\n" + "using namespace std;" + "\n" + "int main() {" + "\n" + "  " + code.replace("\n", "\n  ") + "\n" + "}"
            }
        }
        else if (language == "csharp.net") {
            if (code.includes("static void Main(string[] args) {")) return
            else {
                code = "using System;" + "\n" + "class Program {" + "\n" + "  static void Main(string[] args) {" + "\n" + "    " + code.replace("\n", "\n    ") + "\n" + "  }" + "\n" + "}"
            }
        }
        else if (language == "java") {
            if (code.includes("public static void Main(string[] args) {")) return
            else {
                code = "public class Main {" + "\n" + "  public static void main(String[] args) {" + "\n" + "    " + code.replace("\n", "\n    ") + "\n" + "  }" + "\n" + "}"
            }
        }
        else if (language == "kotlin") {
            if (code.includes("fun main() {")) return
            else {
                code = "fun main() {" + "\n" + "  " + code.replace("\n", "\n  ") + "\n" + "}"
            }
        }
        let result = await axios.post("https://emkc.org/api/v2/piston/execute", {
            "language": language,
            "version": "*",
            "files": [{
                "content": code
            }],
            "stdin": input,
            "args": [input]
        })
        result = result.data
        try {
            let runembed = new EmbedBuilder()
                .setColor("#607387")
                .setAuthor({ name: i.user.username, iconURL: i.user.avatarURL() })
                .setTitle("Evaluation Result")
                .addFields(
                    { name: "Language", value: "```" + "\n" + language + "\n" + "```", inline: false },
                    { name: "Version", value: "```" + "\n" + version + "\n" + "```", inline: false },
                    { name: "Input code", value: "```" + language + "\n" + code.slice(0, 925) + "\n" + "```", inline: false },
                    { name: "Output", value: "```" + language + "\n" + result.run.output.slice(0, 925) + "\n" + "```", inline: false })
            let cancel = new ButtonBuilder()
                .setCustomId(`delete - ${i.user.id}`)
                .setLabel("Delete")
                .setStyle(ButtonStyle.Danger)
            let edit = new ButtonBuilder()
                .setCustomId(`edit - ${i.user.id}`)
                .setLabel("Edit")
                .setStyle(ButtonStyle.Primary)
            let row = new ActionRowBuilder()
                .addComponents(edit, cancel)
            if (input) {
                runembed.addFields({ name: "Input from user", value: "```" + "\n" + input + "\n" + "```", inline: false })
            }
            if (code.length > 925) {
                runembed.setFields(
                    { name: "Language", value: "```" + "\n" + language + "\n" + "```", inline: false },
                    { name: "Version", value: "```" + "\n" + version + "\n" + "```", inline: false },
                    { name: "Input", value: "```" + language + "\n" + code.slice(0, 925) + "\n" + "```" + "**__TOO LONG__**", inline: false },
                    { name: "Output", value: "```" + language + "\n" + result.run.output.slice(0, 925) + "\n" + "```", inline: false })
            }
            if (result.run.output.length > 925) {
                let url = await createPaste({
                    content: result.run.output,
                    expiry_days: 365
                })
                runembed.setFields(
                    { name: "Language", value: "```" + "\n" + language + "\n" + "```", inline: false },
                    { name: "Version", value: "```" + "\n" + version + "\n" + "```", inline: false },
                    { name: "Input", value: "```" + language + "\n" + code.slice(0, 925) + "\n" + "```", inline: false },
                    { name: "Output", value: "```" + language + "\n" + result.run.output.slice(0, 925) + "\n" + "```" + "**__TOO LONG__**" + "\n" + `wiew entire output [here](${url})`, inline: false })
            }
            if (code.length > 925 && result.run.output.length > 925) {
                let url = await createPaste({
                    content: result.run.output,
                    expiry_days: 365
                })
                runembed.setFields(
                    { name: "Language", value: "```" + "\n" + language + "\n" + "```", inline: false },
                    { name: "Version", value: "```" + "\n" + version + "\n" + "```", inline: false },
                    { name: "Input", value: "```" + language + "\n" + code.slice(0, 925) + "\n" + "```" + "**__TOO LONG__**", inline: false },
                    { name: "Output", value: "```" + language + "\n" + result.run.output.slice(0, 925) + "\n" + "```" + "**__TOO LONG__**" + "\n" + `wiew entire output [here](${url})`, inline: false })
            }
            if (result.run.output.length == 0 || result.run.output == "\n") {
                runembed.setFields(
                    { name: "Language", value: "```" + "\n" + language + "\n" + "```", inline: false },
                    { name: "Version", value: "```" + "\n" + version + "\n" + "```", inline: false },
                    { name: "Input", value: "```" + language + "\n" + code.slice(0, 925) + "\n" + "```", inline: false },
                    { name: "Output", value: "No output!", inline: false })
            }
            await i.message.edit({ embeds: [runembed], components: [row] })
            runcodes += 1
        }
        catch (error) {
            let errorembed = new EmbedBuilder()
                .setColor("#607387")
                .setAuthor({ name: i.user.username, iconURL: i.user.avatarURL() })
                .setTitle("Evaluation Result")
                .setDescription("There was an error!")
                .addFields(
                    { name: "Error", value: "```" + "\n" + error + "\n" + "```", inline: false })
            let cancel = new ButtonBuilder()
                .setCustomId(`delete - ${i.user.id}`)
                .setLabel("Delete")
                .setStyle(ButtonStyle.Danger)
            let edit = new ButtonBuilder()
                .setCustomId(`edit - ${i.user.id}`)
                .setLabel("Edit")
                .setStyle(ButtonStyle.Primary)
            let row = new ActionRowBuilder()
                .addComponents(edit, cancel)
            await i.message.edit({ embeds: [errorembed], components: [row] })
            console.log(error)
            runcodes += 1
        }
    }
})
process.on("uncaughtException", e => {
    console.log(e)
})
client.login(config.beta_token)