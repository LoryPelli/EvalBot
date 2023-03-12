export const RUN_CMD = {
    name: "run",
    description: "Run a code (Piston API)",
    options: [
        {
            name: "language",
            description: "programming language",
            type: 3,
            required: true,
            autocomplete: true,
        }
    ]
}
export const LANGS_CMD = {
    name: "languages",
    description: "Show supported programming languages",
}
export const INVITE_CMD = {
    name: "invite",
    description: "Get the bot invite link",
}
export const VOTE_CMD = {
    name: "vote",
    description: "Vote for the bot on topgg",
}
export const EVAL_APP_MENU = {
    name: "Eval",
    type: 3
}