const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const PORT = process.env.PORT || 8080

const app = express()

//middlewares
app.use(cors())
app.use(express.json()) //fazer o app entender json

mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(() => {
    console.log('Connection to MongoDB Database successful!')
}).catch((err) => {
    console.log("Error: Connection to MongoDB Database failed! " + err)
})

//Carregando o model de Produto
require('./models/User')
const User = mongoose.model('User')

require('./models/Favorite')
const Favorite = mongoose.model('Favorite')

//Endpoints
//Criar usuário
app.post('/auth/user', async (req, res) => {
    const { username, email, password } = req.body //pegar do corpo da requisição
    let user = ''

    try {
        user = await User.findOne({ email: email }) //verificar se o email já ta cadastrado(findOne -> retorna o primeiro valor encontrado)
        if(!user) { //se não existir o email
            user = await User.create({ username: username, email: email, password: password })
            return res.status(201).send({user})
        }

        return res.status(417).send({
            error: true,
            message: 'Email already registered, choose another email!'
        })
    } catch (err) {
        return res.status(400).send(err)
    }
})

//Fazer login:
app.get('/auth/user/:email/:password', async (req, res) => {
    const { email, password } = req.params

    try {
        let user = await User.findOne({ email: email, password: password })
        if(email == user.email && password == user.password) {
            res.status(200)
            res.send({
                error: false,
                email: user.email,
                password: user.password,
                id: user._id,
            })
        }
    } catch {
        res.status(404)
        res.send({
            error: true,
            message: 'Incorrect email and/or password!'
        })
    }
})

//Listar usuário
app.get('/auth/user/:user_id', async (req, res) => {
    const { user_id } = req.params
    const users = await User.findById(user_id)
    res.status(200)
    res.send(users)
})

//Listar usuários
app.get('/auth/users', async (req, res) => {
    const users = await User.find()
    res.status(200)
    res.send(users)
})

//Adicionar Favorito
app.post('/favorite/:user_id', async (req, res) => {
    const { pokemon_id, name, types, isFavorite } = req.body
    const { user_id } = req.params
    let favorite = ''

    try {
        favorite = await Favorite.findOne({ pokemon_id, user: user_id })
        if(!favorite) {
            favorite = await Favorite.create({ pokemon_id, name, types, isFavorite, user: user_id })
        }
        return res.status(201).send({ favorite })
    } catch (err) {
        return res.status(400).send(err)
    }
})

//Listar favoritos
app.get('/favorites', async (req, res) => {
    const favorites = await Favorite.find()
    res.status(200)
    res.send(favorites)
})

//Listar favoritos por usuário
app.get('/favorites/:user_id', async (req, res) => {
    const { user_id } = req.params
    const favorites = await Favorite.find({ user: user_id })
    res.status(200)
    res.send(favorites)
})

//Deletar favorito
app.delete('/favorite/:user_id/:pokemon_id', async (req, res) => {
    const { pokemon_id, user_id} = req.params

    try {
        const belongsToUser = await Favorite.findOne({ user: user_id })
        
        if(!belongsToUser) return res.status(400).send('Operation not allowed!')

        const deletedFavorite = await Favorite.findOneAndDelete({user: user_id, pokemon_id})
        res.status(200)
        res.send({
            message: 'Favorite deleted',
            deletedFavorite
        })
    } catch (err) {
        res.status(401)
        res.send(err)
    }
})

//Listar favoritos do usuário

//Listar favoritos usuário

//Deletar usuário
app.delete('/auth/users/:id', async(req, res) => {
    const { id } = req.params //pegar parâmetro na URL

    const users = await User.findByIdAndDelete(id)
    res.status(200)
    res.send(users)
})

//Iniciar servidor
app.listen(PORT, () => console.log(`Server started on port ${PORT}!`))