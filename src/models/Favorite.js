const mongoose = require('mongoose')

mongoose.model('Favorite', {
    pokemon_id: {
        type: Number,
    },
    name: {
        type: String
    },
    types: {
        type: Array
    },
    isFavorite: {
        type: Boolean
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' //Referenciar o model de User
    },
})
