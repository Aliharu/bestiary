const express = require('express')
    , bodyParser = require('body-parser')
    , cors = require('cors')
    , massive = require('massive')
    , { server, connection } = require('./server-config')
    , ctrl = require('./controller')

const app = new express()
app.use(bodyParser.json())
app.use(cors())

/////////////////////////////////
//TESTING TOPLEVEL MIDDLEWARE////
///COMMENT OUT WHEN AUTH0 READY///
/////////////////////////////////
app.use((req, res, next) => {
    if (!req.user) {
        req.user = {
            id: 1,
            email: "mr.peschke@gmail.com",
            patreon: 1
        }
    }
    next();
})

app.get('/api/beasts/catalog', (req, res) => res.send(ctrl.catalogCache))
app.get('/api/beasts/:id', ctrl.getSingleBeast)

app.patch('/api/beasts/edit', ctrl.editBeast)

app.post('/api/beasts/add', ctrl.addBeast)

app.delete('/api/beasts/delete/:id', ctrl.deleteBeast)
// ================================== \\

massive(connection).then(dbI => {
    app.set('db', dbI)
    app.listen(server, _ => {
        ctrl.collectCache(app, 0)
        console.log(`Sing to me a sweet song of forgetfulness and Ill die on your shore ${server}`)
    })
})