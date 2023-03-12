import { InteractionResponseFlags, InteractionResponseType, InteractionType, verifyKey } from "discord-interactions"
import { INVITE_CMD, VOTE_CMD, LANGS_CMD } from "./commands"
import fetch from "node-fetch"
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
                            content: "test",
                            flags: InteractionResponseFlags.EPHEMERAL
                        },
                    })
                }
            }
        }
    },
}