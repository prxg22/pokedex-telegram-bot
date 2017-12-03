class Pokemon {
    constructor(pokemon) {
        this._pokemon = pokemon;
    }

    get name() {
        return this._pokemon.name;
    }

    get img() {
        return this._pokemon.sprites.front_default
    }

    get types() {
        return this._pokemon.types.map(slot => slot.type.name).toString()
    }
}

module.exports = Pokemon;