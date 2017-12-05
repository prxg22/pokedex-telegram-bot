// libs
const TelegramBot = require('telegram-bot-api')
const PokedexAPI = require('pokedex-promise-v2')
const Pokemon = require('./pokemon')

// constants
const telegramToken = process.env.BOT_TOKEN
const Pokedex = new PokedexAPI()
const pokedexQuotes = [
    'I am Dexter. A pokedex programed by Professor Sammuel Oak for pokemon trainer {{name}} of Pallet Town. My function is to provide information about pokemon speicies and their habbitats. If lost or stolen I cannot be replaced. bzzzz',
    'bzzzzzz... I didn\'t find this pokemon bzzzz.. contact Professor Oak!',
    'Which pokemon are you seeing? ',
    'bzzzzzz... Wait until I find your pokemon bzzz',
    '{{img}} \n This is a(n) {{name}}!!\n It\'s types are {{types}}'
]

// globals
const waitingMessages = []

// bot
const bot = new TelegramBot({
        token: process.env.BOT_TOKEN,
        updates: {
            enabled: true
    }
})

const botPokemon = (pokemon, chat) => {
    let msg = pokedexQuotes[4]
        .replace(/{{name}}/g, pokemon.name)
        .replace(/{{types}}/g, pokemon.types)
        .replace(/{{img}}/g, pokemon.img)
    botMessage(msg, chat)
}

const botMessage = (msg, chat) => {
    if (!msg || !chat) console.error('Insert msg and chat')
    bot.sendMessage({chat_id: chat, text: msg})
}

bot.on('update', (update) => {
    if (!update|| !update.message || update.message.chat.type !== 'private') return

    const message = update.message
    const chat = update.message.chat.id
    const user = {
        id: message.from.id,
        name: message.from.first_name
    }

    let index = waitingMessages.indexOf(user.id);
    if (index > -1) {
        botMessage(pokedexQuotes[3], chat)
        waitingMessages.splice(index, 1);
        getPokemon(message.text, chat)
    } else if (message.text === '/open') {
        botMessage(pokedexQuotes[0].replace(/{{name}}/g, user.name), chat)
    } else if (message.text === '/check_pokemon') {
        botMessage(pokedexQuotes[2], chat)
        waitingMessages.push(user.id);
    }
})

// pokemon-api

const getPokemon = (pokemon, chat) => {
    if (!pokemon || !chat) return

    Pokedex.getPokemonByName(pokemon.trim().toLowerCase())
        .then((p) => botPokemon(new Pokemon(p), chat))
        .catch((error) => {
            console.error(error)
            botMessage(pokedexQuotes[1], chat)
        })
}
