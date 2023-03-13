import { InteractionResponseFlags, InteractionResponseType, InteractionType, verifyKey } from "discord-interactions"
import { INVITE_CMD, VOTE_CMD, LANGS_CMD } from "./commands"
import fetch from "node-fetch-native"
import config from "./config.json" assert { type: "json" }
let runtimes = await fetch("https://emkc.org/api/v2/piston/runtimes", {
    method: "GET"
})
runtimes = await runtimes.json()
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
            switch (message.data.name.toLowerCase()) {
                case INVITE_CMD.name.toLowerCase(): {
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
                                            style: 5,
                                            url: "https://discord.com/api/oauth2/authorize?client_id=1076200668810985634&permissions=274877975552&scope=bot%20applications.commands"
                                        }
                                    ]
                                }
                            ],
                            flags: InteractionResponseFlags.EPHEMERAL
                        },
                    })
                }
                case VOTE_CMD.name.toLowerCase(): {
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
                                            style: 5,
                                            url: "https://top.gg/bot/1076200668810985634/vote"
                                        }
                                    ]
                                }
                            ],
                            flags: InteractionResponseFlags.EPHEMERAL
                        },
                    })
                }
                case LANGS_CMD.name.toLowerCase(): {
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
                                            style: 1,
                                            custom_id: "previous1",
                                            disabled: true
                                        },
                                        {
                                            type: 2,
                                            label: "Next",
                                            style: 1,
                                            custom_id: "next1"
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
                                            style: 1,
                                            custom_id: "previous2"
                                        },
                                        {
                                            type: 2,
                                            label: "Next",
                                            style: 1,
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
                                            style: 1,
                                            custom_id: "previous3"
                                        },
                                        {
                                            type: 2,
                                            label: "Next",
                                            style: 1,
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
                                            style: 1,
                                            custom_id: "previous4"
                                        },
                                        {
                                            type: 2,
                                            label: "Next",
                                            style: 1,
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
                                            style: 1,
                                            custom_id: "previous1",
                                            disabled: true
                                        },
                                        {
                                            type: 2,
                                            label: "Next",
                                            style: 1,
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
                                            style: 1,
                                            custom_id: "previous2"
                                        },
                                        {
                                            type: 2,
                                            label: "Next",
                                            style: 1,
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
                                            style: 1,
                                            custom_id: "previous3"
                                        },
                                        {
                                            type: 2,
                                            label: "Next",
                                            style: 1,
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
    }
}