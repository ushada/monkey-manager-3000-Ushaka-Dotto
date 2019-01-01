const express = require('express')
const bodyParser = require('body-parser');
const Routes = require('./routes');
const morgan = require('morgan');
const pug = require('pug');
const path = require('path');
const app = express()
const models = require('./models/index');

//*************************************************\\
//                                                 \\
//                   MODULES                       \\
//                                                 \\
//*************************************************\\

//Association Enclos --- Monkey
models.Monkey.belongsTo(models.Enclosure)
models.Enclosure.hasMany(models.Monkey, { as: "Monkeys" })


//Add views
app.set('view engine', 'pug');
app.set('views', path.join(__dirname,'./views'))

// Decode json and x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Add a bit of logging
app.use(morgan('short'))

//Servir des fichiers statiques dans Express
app.use(express.static(__dirname + '/public'));

//*************************************************\\
//                                                 \\
//               EXPRESS, PUG                      \\
//                                                 \\
//*************************************************\\


app.get('/',Routes.indexHandler)

app.get('/form-monkey', Routes.formMonkeyHandler) // Formulaire pour l'ajout d'un singe
app.post('/form-monkey', Routes.submitMonkeyHandler) // Valide le formulaire d'ajout de singe
app.get('/detail-monkey/:id', Routes.diplayDetailMonkeyHandler) // Détail d'un singe
app.post('/delete-monkey/:id', Routes.deleteMonkeyHandler) //Supprime un singe
app.get('/update-monkey/:id', Routes.formUpdateMonkeyHandler) //Formulaire pour la maj un singe
app.post('/update-monkey/:id', Routes.updateMonkeyHandler) // Maj un singe


app.get('/display-enclosures', Routes.diplayEnclosureHandler) //Affiche tous les enclos
app.get('/detail-enclosure/:id', Routes.diplayDetailEnclosureHandler)//Détail d'un enclos
app.get('/form-enclosure', Routes.formEnclosureHandler)//  Formulaire pour l'ajout un enclos
app.post('/form-enclosure', Routes.submitEnclosureHandler)//Valide le formulaire d'ajout de d'enclos
app.post('/delete-enclosure/:id', Routes.deleteEnclosureHandler)//Supprime un enclos
app.get('/update-enclosure/:id', Routes.formUpdateEnclosureHandler)//Formulaire pour update un enclos
app.post('/update-enclosure/:id', Routes.updateEnclosureHandler)// Maj un enclos



//*************************************************\\
//                                                 \\
//                   API REST                      \\
//                                                 \\
//*************************************************\\



//GET ALL MONKEYS
app.get('/apirest/monkeys', function (req, res) {
    models.Monkey.findAll({
        where: req.query
    })
        .then((monkeys) => {
            res.json(monkeys)
        })
        .catch((err) => {
            res.json(err)
        })
})

//GET ALL ENCLOSUREs
app.get('/apirest/enclosures', function (req, res) {
    models.Enclosure.findAll({
        where: req.query
    })
        .then((enclosures) => {
            res.json(enclosures)
        })
        .catch((err) => {
            res.json(err)
        })
})

//CREATE A MONKEY
app.post('/apirest/monkey', function (req, res) {
    models.Monkey.create({
        name: req.body.name,
        height: req.body.height,
        weight: req.body.weight
    })
        .then((monkey) => {
            res.json(monkey);
        })
        .catch((err) => {
            res.json(err)
        })
})

//CREATE AN ENCLOSSURE
app.post('/apirest/enclosure', function (req, res) {
    models.Monkey.create({
        name: req.body.name,
        description: req.body.description,
        surface: req.body.surface
    })
        .then((monkey) => {
            res.json(monkey);
        })
        .catch((err) => {
            res.json(err)
        })
})

//UPDATE MONKEY
app.put('/apirest/monkey', function (req, res) {
    const promises = [];

    req.body.mutations
        .forEach((item) => {

            promises.push(
                models.Monkey.update(
                    item.data,
                    {
                        where: {
                            id: item.id
                        }
                    }
                )
            )

        })

    Promise.all(promises)
        .then((response) => {
            res.json(response);
        })
        .catch((err) => {
            res.json(err)
        })
})

//UPDATE ENCLOSURE
app.put('/apirest/enclosure', function (req, res) {
    const promises = [];

    req.body.mutations
        .forEach((item) => {

            promises.push(
                models.Enclosure.update(
                    item.data,
                    {
                        where: {
                            id: item.id
                        }
                    }
                )
            )

        })

    Promise.all(promises)
        .then((response) => {
            res.json(response);
        })
        .catch((err) => {
            res.json(err)
        })
})

//DELETE MONKEY
app.delete('/apirest/monkey', function (req, res) {
    models.Monkey.destroy({
        where: {
            id: req.body.ids
        }
    })
        .then((response) => {
            res.json(response)
        })
        .catch((err) => {
            res.json(err)
        })
})

//DELETE ENCLOSURE
app.delete('/apirest/enclosure', function (req, res) {
    models.Enclosure.destroy({
        where: {
            id: req.body.id
        }
    })
        .then((response) => {
            res.json(response)
        })
        .catch((err) => {
            res.json(err)
        })
})

//GET MONKEY BY ID
app.get('/apirest/monkey/:id', function (req, res) {
    models.Monkey.findOne({
        id: req.params.id
    })
        .then((monkey) => {
            res.json(monkey)
        })
        .catch((err) => {
            res.json(err)
        })
})

//GET ENCLOSURE BY ID
app.get('/apirest/enclosure/:id', function (req, res) {
    models.Enclosure.findOne({
        id: req.params.id
    })
        .then((enclosure) => {
            res.json(enclosure)
        })
        .catch((err) => {
            res.json(err)
        })
})

//UPDATE MONKEY BY ID
app.put('/apirest/monkey/:id', function (req, res) {
    models.Monkey.update(
        req.body,
        {
            where: {
                id: req.params.id
            }
        })
        .then((monkey) => {
            res.json(monkey)
        })
        .catch((err) => {
            res.json(err)
        })
})

//UPDATE ENCLOSURE BY ID
app.put('/apirest/enclosure/:id', function (req, res) {
    models.Enclosure.update(
        req.body,
        {
            where: {
                id: req.params.id
            }
        })
        .then((enclosure) => {
            res.json(enclosure)
        })
        .catch((err) => {
            res.json(err)
        })
})

//DELETE MONKEY BY ID
app.delete('/apirest/monkey/:id', function (req, res) {
    models.Monkey.destroy({
        where: {
            id: req.params.id
        }
    })
        .then((response) => {
            res.json(response);
        })
        .catch((err) => {
            res.json(err)
        })
})

//DELETE ENCLOSURE BY ID
app.delete('/apirest/enclosure/:id', function (req, res) {
    models.Enclosure.destroy({
        where: {
            id: req.params.id
        }
    })
        .then((response) => {
            res.json(response);
        })
        .catch((err) => {
            res.json(err)
        })
})

// Synchronize models
models.sequelize.sync(/*{ force: true }*/).then(function () {
  /**
   * Listen on provided port, on all network interfaces.
   * 
   * Listen only when database connection is sucessfull
   */


    app.listen(process.env.PORT, function () {
    console.log('Express server listening on port 3000');
  });
});
