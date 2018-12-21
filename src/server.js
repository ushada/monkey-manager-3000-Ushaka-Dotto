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

//*************************************************\\
//                                                 \\
//               EXPRESS, PUG                      \\
//                                                 \\
//*************************************************\\


app.get('/',Routes.indexHandler)

app.get('/form-monkey', Routes.formMonkeyHandler) // Récupère un formulaire pour l'ajout d'un singe
app.post('/form-monkey', Routes.submitMonkeyHandler) // Submit un formulaire d'ajout de singe
app.get('/detail-monkey/:id', Routes.diplayDetailMonkeyHandler) // Récupère le détail d'un singe
app.post('/delete-monkey/:id', Routes.deleteMonkeyHandler) //Supprime un singe
app.get('/update-monkey/:id', Routes.formUpdateMonkeyHandler) //Récupère un formulaire pour update un singe
app.post('/update-monkey/:id', Routes.updateMonkeyHandler) // Update un singe


app.get('/display-enclosures', Routes.diplayEnclosureHandler) //Récupère tous les enclos
app.get('/detail-enclosure/:id', Routes.diplayDetailEnclosureHandler)//Récupère le détail d'un enclos
app.get('/form-enclosure', Routes.formEnclosureHandler)//  Récupère un formulaire pour ajouter un enclos
app.post('/form-enclosure', Routes.submitEnclosureHandler)//Submit un formulaire d'ajout de d'enclos
app.post('/delete-enclosure/:id', Routes.deleteEnclosureHandler)//Supprime un enclos
app.get('/update-enclosure/:id', Routes.formUpdateEnclosureHandler)//Récupère un formulaire pour update un enclos
app.post('/update-enclosure/:id', Routes.updateEnclosureHandler)// Update un enclos



//*************************************************\\
//                                                 \\
//                   API REST                      \\
//                                                 \\
//*************************************************\\



//GET ALL MONKEYS
app.get('/monkey', function (req, res) {
    models.Monkey.findAll({
        where: req.query
    })
        .then((monkey) => {
            res.json(monkey)
        })
        .catch((err) => {
            res.json(err)
        })
})

//CREATE A MONKEY
app.post('/monkey', function (req, res) {
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

//UPDATE MONKEY
app.put('/monkey', function (req, res) {
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

//DELETE MONKEY
app.delete('/monkey', function (req, res) {
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

//GET MONKEY BY ID
app.get('/monkey/:id', function (req, res) {
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

//UPDATE MONKEY BY ID
app.put('/monkey/:id', function (req, res) {
    models.Monkey.update(
        req.body,
        {
            where: {
                id: req.params.id
            }
        })
        .then((gremelin) => {
            res.json(gremelin)
        })
        .catch((err) => {
            res.json(err)
        })
})

//DELETE MONKEY BY ID
app.delete('/monkey/:id', function (req, res) {
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
