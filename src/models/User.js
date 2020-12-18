const mongoose = require('mongoose')

//Definir model (model - referência a uma collection)
mongoose.model("User", {
    username: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    }
})


































