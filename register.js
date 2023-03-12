import { EVAL_APP_MENU, INVITE_CMD, LANGS_CMD, RUN_CMD, VOTE_CMD } from "./commands.js"
import fetch from 'node-fetch'
import config from "./config.json" assert { type: "json" }
const token = config.TOKEN
const applicationId = config.ID
async function registerCommands() {
    const url = `https://discord.com/api/applications/${applicationId}/commands`;
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bot ${token}`,
        },
        method: 'PUT',
        body: JSON.stringify([RUN_CMD, LANGS_CMD, INVITE_CMD, VOTE_CMD, EVAL_APP_MENU]),
    })
    if (response.ok) {
        console.log('Registered all commands')
    } else {
        console.error('Error registering commands')
        const text = await response.text()
        console.error(text)
    }
    return response
}
await registerCommands()