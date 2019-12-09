const express = require('express')
    , bodyParser = require('body-parser')
    , cors = require('cors')
    , massive = require('massive')
    , { server, connection } = require('./server-config')
    , ctrl = require('./controller')

const app = new express()
app.use(bodyParser.json())
app.use(cors())

let beasts = []
let fakeBeastDB = []

let letterArray = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

for (let i = 0; i < letterArray.length; i++) {
    let newBeast = ctrl.makeMonsters(letterArray[i])
    beasts.push(newBeast)
    fakeBeastDB.push(...newBeast)
}

app.get('/api/beasts/catalog', (req, res) => res.send(beasts))
app.get('/api/beasts/:id', (req, res) => res.send(fakeBeastDB[+req.params.id - 1]))
// ================================== \\

massive(connection).then(dbI => {
    app.set('db', dbI)
    app.listen(server, _ => {
        console.log(`Sing to me a sweet song of forgetfulness and Ill die on your shore ${server}`)
    })
})