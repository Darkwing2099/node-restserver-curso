require('./config/config');

const express = require('express')
const app = express()
const mongoose = require('mongoose')

const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(require('./routes/user'))

let mongodbConnect = async() => {
    await mongoose.connect(process.env.URL_DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    });
}

mongodbConnect()
    .then(() => console.log('Base de datos ONLINE'))
    .catch((err) => console.log('Error al conectar a la base de datos'))

// mongoose.connect('mongodb://localhost:27017/cafe', (err, res) => {

//     if (err) throw err

//     console.log('Base de datos ONLINE');

// })

app.listen(process.env.PORT, () => {
    console.log(`Escuchando puerto: ${process.env.PORT}`);
})