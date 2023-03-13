import { InteractionResponseFlags, InteractionResponseType, InteractionType, verifyKey, ButtonStyleTypes, TextStyleTypes } from "discord-interactions"
import { INVITE_CMD, VOTE_CMD, LANGS_CMD, RUN_CMD } from "./commands"
import fetch from "node-fetch-native"
import config from "./config.json" assert { type: "json" }
class JsonResponse extends Response {
    constructor(body, init) {
        const jsonBody = JSON.stringify(body)
        init = init || {
            headers: {
                'content-type': 'application/json;charset=UTF-8',
            },
        };
        super(jsonBody, init)
    }
}
export default {
    async fetch(request) {
        let runtimes = await fetch("https://emkc.org/api/v2/piston/runtimes", {
            method: "GET"
        })
        runtimes = await runtimes.json()
        const signature = request.headers.get('x-signature-ed25519')
        const timestamp = request.headers.get('x-signature-timestamp')
        const body = await request.clone().arrayBuffer()
        const isValidRequest = verifyKey(
            body,
            signature,
            timestamp,
            config.PUBLIC_KEY
        )
        if (!isValidRequest) {
            return new Response('The request signature is not valid', { status: 401 })
        }
        const message = await request.json()
        if (message.type === InteractionType.PING) {
            return new JsonResponse({
                type: InteractionResponseType.PONG,
            })
        }
        else if (message.type === InteractionType.APPLICATION_COMMAND) {
            switch (message.data.name) {
                case INVITE_CMD.name: {
                    return new JsonResponse({
                        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                        data: {
                            components: [
                                {
                                    type: 1,
                                    components: [
                                        {
                                            type: 2,
                                            label: "Invite",
                                            style: ButtonStyleTypes.LINK,
                                            url: "https://discord.com/api/oauth2/authorize?client_id=1076200668810985634&permissions=274877975552&scope=bot%20applications.commands"
                                        }
                                    ]
                                }
                            ],
                            flags: InteractionResponseFlags.EPHEMERAL
                        },
                    })
                }
                case VOTE_CMD.name: {
                    return new JsonResponse({
                        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                        data: {
                            components: [
                                {
                                    type: 1,
                                    components: [
                                        {
                                            type: 2,
                                            label: "Vote",
                                            style: ButtonStyleTypes.LINK,
                                            url: "https://top.gg/bot/1076200668810985634/vote"
                                        }
                                    ]
                                }
                            ],
                            flags: InteractionResponseFlags.EPHEMERAL
                        },
                    })
                }
                case LANGS_CMD.name: {
                    let languages = []
                    for (let c = 0; c < runtimes.length; c++) {
                        languages.push({ name: `Language: ${runtimes[c].language}`, value: `Version: ${runtimes[c].version}`, inline: true })
                    }
                    return new JsonResponse({
                        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                        data: {
                            embeds: [
                                {
                                    title: "Supported Languages",
                                    description: `Total languages: ${runtimes.length}`,
                                    fields: languages.slice(0, 25)
                                }
                            ],
                            components: [
                                {
                                    type: 1,
                                    components: [
                                        {
                                            type: 2,
                                            label: "Previous",
                                            style: ButtonStyleTypes.PRIMARY,
                                            custom_id: "previous1",
                                            disabled: true
                                        },
                                        {
                                            type: 2,
                                            label: "Next",
                                            style: ButtonStyleTypes.PRIMARY,
                                            custom_id: "next1"
                                        }
                                    ]
                                }
                            ],
                            flags: InteractionResponseFlags.EPHEMERAL
                        },
                    })
                }
                case RUN_CMD.name: {
                    let languageoption = message.data.options[0].value.split(" - ")[0]
                    let version
                    for (let i = 0; i < runtimes.length; i++) {
                        if (languageoption == runtimes[i].language) {
                            version = runtimes[i].version
                        }
                    }
                    if (version == undefined) {
                        return new JsonResponse({
                            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                            data: {
                                content: "Uknown Language!",
                                flags: InteractionResponseFlags.EPHEMERAL
                            },
                        })
                    }
                    return new JsonResponse({
                        type: InteractionResponseType.MODAL,
                        data: {
                            title: "Run Code",
                            custom_id: "run",
                            components: [
                                {
                                    type: 1,
                                    components: [
                                        {
                                            type: 4,
                                            label: "Language",
                                            style: TextStyleTypes.SHORT,
                                            custom_id: "language",
                                            required: true,
                                            min_length: 1,
                                            max_length: 10,
                                            value: languageoption
                                        }
                                    ]
                                },
                                {
                                    type: 1,
                                    components: [
                                        {
                                            type: 4,
                                            label: "Code",
                                            style: TextStyleTypes.PARAGRAPH,
                                            custom_id: "code",
                                            required: true,
                                            min_length: 5
                                        }
                                    ]
                                },
                                {
                                    type: 1,
                                    components: [
                                        {
                                            type: 4,
                                            label: "Input (separate with comma)",
                                            style: TextStyleTypes.SHORT,
                                            custom_id: "input",
                                            required: false,
                                            placeholder: "(optional)"
                                        }
                                    ]
                                }
                            ],
                        }
                    })
                }
            }
        }
        else if (message.type === InteractionType.MESSAGE_COMPONENT) {
            switch (message.data.custom_id) {
                case "next1": {
                    let languages = []
                    for (let c = 0; c < runtimes.length; c++) {
                        languages.push({ name: `Language: ${runtimes[c].language}`, value: `Version: ${runtimes[c].version}`, inline: true })
                    }
                    return new JsonResponse({
                        type: InteractionResponseType.UPDATE_MESSAGE,
                        data: {
                            embeds: [
                                {
                                    title: "Supported Languages",
                                    description: `Total languages: ${runtimes.length}`,
                                    fields: languages.slice(25, 50)
                                }
                            ],
                            components: [
                                {
                                    type: 1,
                                    components: [
                                        {
                                            type: 2,
                                            label: "Previous",
                                            style: ButtonStyleTypes.PRIMARY,
                                            custom_id: "previous2"
                                        },
                                        {
                                            type: 2,
                                            label: "Next",
                                            style: ButtonStyleTypes.PRIMARY,
                                            custom_id: "next2"
                                        }
                                    ]
                                }
                            ],
                            flags: InteractionResponseFlags.EPHEMERAL
                        },
                    })
                }
                case "next2": {
                    let languages = []
                    for (let c = 0; c < runtimes.length; c++) {
                        languages.push({ name: `Language: ${runtimes[c].language}`, value: `Version: ${runtimes[c].version}`, inline: true })
                    }
                    return new JsonResponse({
                        type: InteractionResponseType.UPDATE_MESSAGE,
                        data: {
                            embeds: [
                                {
                                    title: "Supported Languages",
                                    description: `Total languages: ${runtimes.length}`,
                                    fields: languages.slice(50, 75)
                                }
                            ],
                            components: [
                                {
                                    type: 1,
                                    components: [
                                        {
                                            type: 2,
                                            label: "Previous",
                                            style: ButtonStyleTypes.PRIMARY,
                                            custom_id: "previous3"
                                        },
                                        {
                                            type: 2,
                                            label: "Next",
                                            style: ButtonStyleTypes.PRIMARY,
                                            custom_id: "next3"
                                        }
                                    ]
                                }
                            ],
                            flags: InteractionResponseFlags.EPHEMERAL
                        },
                    })
                }
                case "next3": {
                    let languages = []
                    for (let c = 0; c < runtimes.length; c++) {
                        languages.push({ name: `Language: ${runtimes[c].language}`, value: `Version: ${runtimes[c].version}`, inline: true })
                    }
                    return new JsonResponse({
                        type: InteractionResponseType.UPDATE_MESSAGE,
                        data: {
                            embeds: [
                                {
                                    title: "Supported Languages",
                                    description: `Total languages: ${runtimes.length}`,
                                    fields: languages.slice(75)
                                }
                            ],
                            components: [
                                {
                                    type: 1,
                                    components: [
                                        {
                                            type: 2,
                                            label: "Previous",
                                            style: ButtonStyleTypes.PRIMARY,
                                            custom_id: "previous4"
                                        },
                                        {
                                            type: 2,
                                            label: "Next",
                                            style: ButtonStyleTypes.PRIMARY,
                                            custom_id: "next4",
                                            disabled: true
                                        }
                                    ]
                                }
                            ],
                            flags: InteractionResponseFlags.EPHEMERAL
                        },
                    })
                }
                case "previous2": {
                    let languages = []
                    for (let c = 0; c < runtimes.length; c++) {
                        languages.push({ name: `Language: ${runtimes[c].language}`, value: `Version: ${runtimes[c].version}`, inline: true })
                    }
                    return new JsonResponse({
                        type: InteractionResponseType.UPDATE_MESSAGE,
                        data: {
                            embeds: [
                                {
                                    title: "Supported Languages",
                                    description: `Total languages: ${runtimes.length}`,
                                    fields: languages.slice(0, 25)
                                }
                            ],
                            components: [
                                {
                                    type: 1,
                                    components: [
                                        {
                                            type: 2,
                                            label: "Previous",
                                            style: ButtonStyleTypes.PRIMARY,
                                            custom_id: "previous1",
                                            disabled: true
                                        },
                                        {
                                            type: 2,
                                            label: "Next",
                                            style: ButtonStyleTypes.PRIMARY,
                                            custom_id: "next1"
                                        }
                                    ]
                                }
                            ],
                            flags: InteractionResponseFlags.EPHEMERAL
                        },
                    })
                }
                case "previous3": {
                    let languages = []
                    for (let c = 0; c < runtimes.length; c++) {
                        languages.push({ name: `Language: ${runtimes[c].language}`, value: `Version: ${runtimes[c].version}`, inline: true })
                    }
                    return new JsonResponse({
                        type: InteractionResponseType.UPDATE_MESSAGE,
                        data: {
                            embeds: [
                                {
                                    title: "Supported Languages",
                                    description: `Total languages: ${runtimes.length}`,
                                    fields: languages.slice(25, 50)
                                }
                            ],
                            components: [
                                {
                                    type: 1,
                                    components: [
                                        {
                                            type: 2,
                                            label: "Previous",
                                            style: ButtonStyleTypes.PRIMARY,
                                            custom_id: "previous2"
                                        },
                                        {
                                            type: 2,
                                            label: "Next",
                                            style: ButtonStyleTypes.PRIMARY,
                                            custom_id: "next2"
                                        }
                                    ]
                                }
                            ],
                            flags: InteractionResponseFlags.EPHEMERAL
                        },
                    })
                }
                case "previous4": {
                    let languages = []
                    for (let c = 0; c < runtimes.length; c++) {
                        languages.push({ name: `Language: ${runtimes[c].language}`, value: `Version: ${runtimes[c].version}`, inline: true })
                    }
                    return new JsonResponse({
                        type: InteractionResponseType.UPDATE_MESSAGE,
                        data: {
                            embeds: [
                                {
                                    title: "Supported Languages",
                                    description: `Total languages: ${runtimes.length}`,
                                    fields: languages.slice(50, 75)
                                }
                            ],
                            components: [
                                {
                                    type: 1,
                                    components: [
                                        {
                                            type: 2,
                                            label: "Previous",
                                            style: ButtonStyleTypes.PRIMARY,
                                            custom_id: "previous3"
                                        },
                                        {
                                            type: 2,
                                            label: "Next",
                                            style: ButtonStyleTypes.PRIMARY,
                                            custom_id: "next3"
                                        }
                                    ]
                                }
                            ],
                            flags: InteractionResponseFlags.EPHEMERAL
                        },
                    })
                }
            }
        }
        else if (message.type === InteractionType.APPLICATION_COMMAND_AUTOCOMPLETE) {
            let languageoption = message.data.options[0].value
            if (languageoption.length == 0) {
                let filter = runtimes.slice(0, 25).filter(choice => choice.language.startsWith(languageoption))
                return new JsonResponse({
                    type: InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT,
                    data: {
                        choices: filter.map(choice => ({ name: `${choice.language} - ${choice.version}`, value: `${choice.language} - ${choice.version}` }))
                    }
                })
            }
            let filter = runtimes.filter(choice => choice.language.startsWith(languageoption))
            return new JsonResponse({
                type: InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT,
                data: {
                    choices: filter.map(choice => ({ name: `${choice.language} - ${choice.version}`, value: `${choice.language} - ${choice.version}` }))
                }
            })
        }
        else if (message.type === InteractionType.MODAL_SUBMIT) {
            switch (message.data.custom_id) {
                case "run": {
                    let language = message.data.components[0].components[0].value.toLowerCase()
                    let code = message.data.components[1].components[0].value.replace(/`/g, "`\u200b")
                    let input = "" || message.data.components[2].components[0].value
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
                        return new JsonResponse({
                            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                            data: {
                                content: "Unknown Language!",
                                flags: InteractionResponseFlags.EPHEMERAL
                            }
                        })
                    }
                    if (language == "go") {
                        if (code.includes("func main() {")) return
                        else {
                            code = "package main" + "\n" + "import \"fmt\"" + "\n" + "func main() {" + "\n" + "  " + code.replace(/\n/g, "\n  ") + "\n" + "}"
                        }
                    }
                    else if (language == "rust") {
                        if (code.includes("fn main() {")) return
                        else {
                            code = "use std::io;" + "\n" + "fn main() {" + "\n" + "  " + code.replace(/\n/g, "\n  ") + "\n" + "}"
                        }
                    }
                    else if (language == "c") {
                        if (code.includes("int main() {")) return
                        else {
                            code = "#include <stdio.h>" + "\n" + "int main() {" + "\n" + "  " + code.replace(/\n/g, "\n  ") + "\n" + "}"
                        }
                    }
                    else if (language == "c++") {
                        if (code.includes("int main() {")) return
                        else {
                            code = "#include <iostream>" + "\n" + "using namespace std;" + "\n" + "int main() {" + "\n" + "  " + code.replace(/\n/g, "\n  ") + "\n" + "}"
                        }
                    }
                    else if (language == "csharp.net") {
                        if (code.includes("static void Main(string[] args) {")) return
                        else {
                            code = "using System;" + "\n" + "class Program {" + "\n" + "  static void Main(string[] args) {" + "\n" + "    " + code.replace(/\n/g, "\n    ") + "\n" + "  }" + "\n" + "}"
                        }
                    }
                    else if (language == "java") {
                        if (code.includes("public static void Main(string[] args) {")) return
                        else {
                            code = "public class Main {" + "\n" + "  public static void main(String[] args) {" + "\n" + "    " + code.replace(/\n/g, "\n    ") + "\n" + "  }" + "\n" + "}"
                        }
                    }
                    else if (language == "kotlin") {
                        if (code.includes("fun main() {")) return
                        else {
                            code = "fun main() {" + "\n" + "  " + code.replace(/\n/g, "\n  ") + "\n" + "}"
                        }
                    }
                    let result = await fetch("https://emkc.org/api/v2/piston/execute", {
                        method: "POST",
                        body: JSON.stringify({
                            "language": language,
                            "version": "*",
                            "files": [{
                                "content": code
                            }],
                            "stdin": input,
                            "args": input.split(",")
                        })
                    })
                    result = await result.json()
                    let runembed = {
                        title: "Evaluation Result",
                        fields: [
                            { name: "Language", value: "```" + "\n" + language + "\n" + "```", inline: false },
                            { name: "Version", value: "```" + "\n" + version + "\n" + "```", inline: false },
                            { name: "Input code", value: "```" + language + "\n" + code.slice(0, 925) + "\n" + "```", inline: false },
                            { name: "Output", value: "```" + language + "\n" + result.run.output.slice(0, 925) + "\n" + "```", inline: false },
                            { name: "Output code", value: "```" + "\n" + result.run.code + "\n" + "```", inline: false }
                        ]
                    }
                    return new JsonResponse({
                        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                        data: {
                            embeds: [runembed]
                        }
                    })
                }
            }
        }
    }
}