// JavaScript source code
const models = require('./models/index');

exports.indexHandler = (req,res) => {
    res.render('index')
}

//********** HANDLERS ECNLOSURES ***********\\

//Affichage enclos
exports.diplayEnclosureHandler = (req, res) => {


    var Message = ''
    var HaveEnclosure = false;
    models.Enclosure.findAll({
        where: req.query
    })
        .then((Enclosures) => {
            
            if (Enclosures.length > 0) {
                HaveEnclosure = true;
            }
            else {
                HaveEnclosure = false;
            }   
            res.render('display-enclosures', {
                haveEnclosure: HaveEnclosure,
                enclosures: Enclosures,
                message: Message
            })
        })
        .catch((err) => {
            res.render('', {
                monkeys: Monkeys,
                message: err
            })
        })


                        
}

exports.diplayDetailEnclosureHandler = (req, res) => {

    var Message = ''
    models.Enclosure.findOne({
        where: { id: req.params.id }
    })
        .then((Enclosure) => {

            Enclosure.getMonkeys().then((associatedtasks) => {
                res.render('detail-enclosure', {
                    monkeys: associatedtasks,
                    enclosure: Enclosure,
                    message: Message
                })

            })


        })
        .catch((err) => {
            res.render('', {
                monkeys: Monkeys,
                message: err
            })
        })



}


//Création d'un enclos
exports.submitEnclosureHandler = (req, res) => {
    models.Enclosure.create({
        name: req.body.name,
        description: req.body.description,
        surface: req.body.surface
    })
        .then((enclosure) => {
            res.render('form-enclosure', {
                message: 'Creating ' + req.body.name + ' done!',
                active:true
            })
        })
        .catch((err) => {
            res.render('form-enclosure', {
                message: 'DataBaseError: Missing datas.Please recomplete the form.',
                active:true
            })
        })

   
}

exports.formEnclosureHandler = (req, res) => {
    res.render('form-enclosure')
}


//Suppression enclos
exports.deleteEnclosureHandler = (req, res) => {

    var Message = 'Deleting done.'
    models.Monkey.destroy({ where: {} }).then(() => {
        models.Enclosure.destroy({
            where: { id: req.params.id }
        })
            .then(enclosure => {


                var HaveEnclosure = false;
                models.Enclosure.findAll({
                    where: req.query
                })
                    .then((Enclosures) => {

                        if (Enclosures.length > 0) {
                            HaveEnclosure = true;
                        }
                        else {
                            HaveEnclosure = false;
                        }
                        res.render('display-enclosures', {
                            haveEnclosure: HaveEnclosure,
                            enclosures: Enclosures,
                            message: Message
                        })
                    })
                    .catch((err) => {
                        res.render('', {
                            message: err
                        })
                    })

            })
            .catch((err) => {
                res.render('', {
                    message: err
                })
            })

    })
        .catch((err) => {
            res.render('', {
                message: err
            })
        })





}

//Update enclos
exports.updateEnclosureHandler = (req, res) => {

    var Message = 'Update done.'
    models.Enclosure.findOne({
        where: { id: req.params.id }
    })
        .then(enclosure => {

            enclosure.update({
                name: req.body.name,
                description: req.body.description,
                surface: req.body.surface
            })
                .then(() => {

                    var HaveEnclosure = false;
                    models.Enclosure.findAll({
                        where: {}
                    })
                        .then((Enclosures) => {

                            if (Enclosures.length > 0) {
                                HaveEnclosure = true;
                            }
                            else {
                                HaveEnclosure = false;
                            }
                            res.render('display-enclosures', {
                                haveEnclosure: HaveEnclosure,
                                enclosures: Enclosures,
                                message: Message
                            })
                        })
                        .catch((err) => {
                            res.render('', {
                                message: err
                            })
                        })
                })
                .catch((err) => {
                    res.render('', {
                        message: 'DataBaseError: Missing datas.Please recomplete the form.'
                    })
                })


        })
        .catch((err) => {
            res.render('', {
                message: err
            })
        })




}



//********** HANDLERS MONKEYS ***********\\

//Ajout d'un singe
exports.formMonkeyHandler = (req, res) => {
    var Message = ''
    models.Enclosure.findAll({
        where: req.query
    })
        .then((Enclosures) => {
            res.render('form-monkey', {
                enclosures: Enclosures,
                message: Message
            })
        })
        .catch((err) => {
            res.render('', {
                message: err
            })
        })

}

exports.submitMonkeyHandler = (req, res) => {

    models.Enclosure.findOne({ where: { id: req.body.enclosure } })
        .then(enclosure => {
                models.Monkey.create({
                    name: req.body.name,
                    species: req.body.species,
                    height: req.body.height,
                    weight: req.body.weight

                })
                    .then((monkey) => {
                        enclosure.addMonkeys(monkey)
                        res.render('form-monkey', {
                            message: 'Creating ' + req.body.name + ' done!',
                            active: true
                        })


                    })
                    .catch((err) => {
                        res.render('form-monkey', {
                            message: 'DataBaseError: Missing datas.Please recomplete the form.',
                            active: true
                        })
                    })
            
        })
        .catch((err) => {
            res.render('', {
                message: err
            })
        })





}

//Affichage singes
exports.diplayDetailMonkeyHandler = (req, res) => {

 
    var Message = ''
    var HaveEnclosure = false;
    models.Monkey.findOne({
        where: { id: req.params.id }
    })
        .then((Monkey) => {

            Monkey.getEnclosure().then((associatedtasks) => {
                res.render('detail-monkey', {
                    enclosure: associatedtasks,
                    monkey:Monkey,
                    message: Message
                })

            })


        })
        .catch(err => {
            res.render('', {
                message: err
            })
        })



}


//Supprimer singe
exports.deleteMonkeyHandler = (req, res) => {

    var Message = 'Deleting done.'
    models.Monkey.destroy({
        where: { id: req.params.id }
    })
        .then(monkey => {
            var HaveEnclosure = false;
            models.Enclosure.findAll({
                where: req.query
            })
                .then((Enclosures) => {

                    if (Enclosures.length > 0) {
                        HaveEnclosure = true;
                    }
                    else {
                        HaveEnclosure = false;
                    }
                    res.render('display-enclosures', {
                        haveEnclosure: HaveEnclosure,
                        enclosures: Enclosures,
                        message: Message
                    })
                })
                .catch((err) => {
                    res.render('', {
                        monkeys: Monkeys,
                        message: err
                    })
                })
            
        })
        .catch((err) => {
            res.render('', {
                message: err
            })
        })
       



}

//Update singe
exports.updateMonkeyHandler = (req, res) => {

    var Message = 'Update done.'
    models.Monkey.findOne({
        where: { id: req.params.id }
    })
        .then(monkey => {

            monkey.update({
                name: req.body.name,
                height: req.body.height,
                weight: req.body.weight,
                species: req.body.species
            })
                .then(() => {
                    if (req.body.enclosure) {
                        models.Enclosure.findOne({ where: { id: req.params.id } }).then((enclosure) => { enclosure.removeMonkeys(monkey) })
                        models.Enclosure.findOne({ where: { id: req.body.enclosure } }).then((enclosure) => { enclosure.addMonkeys(monkey) })
                    }

                    var HaveEnclosure = false;
                    models.Enclosure.findAll({
                        where: req.query
                    })
                        .then((Enclosures) => {

                            if (Enclosures.length > 0) {
                                HaveEnclosure = true;
                            }
                            else {
                                HaveEnclosure = false;
                            }
                            res.render('display-enclosures', {
                                haveEnclosure: HaveEnclosure,
                                enclosures: Enclosures,
                                message: Message
                            })
                        })
                        .catch((err) => {
                            res.render('', {
                                message: err
                            })
                        })
                })
                .catch((err) => {
                    res.render('', {
                        message: 'DataBaseError: Missing datas. Please complete the form.'
                    })
                })
            

        })
        .catch((err) => {
            res.render('', {
                message: err
            })
        })




}

exports.formUpdateEnclosureHandler = (req, res) => {

    var Message = ''
    models.Enclosure.findAll({
        where: req.query
    })
        .then((Enclosures) => {
            res.render('form-update-enclosure', {
                enclosures: Enclosures,
                Id: req.params.id,
                message: Message
            })
        })
        .catch((err) => {
            res.render('', {
                message: err
            })
        })
}

//Ajout d'un singe
exports.formUpdateMonkeyHandler = (req, res) => {

    var Message = ''
    models.Enclosure.findAll({
        where: req.query
    })
        .then((Enclosures) => {
            res.render('form-update-monkey', {
                enclosures: Enclosures,
                Id:req.params.id,
                message: Message
            })
        })
        .catch((err) => {
            res.render('', {
                message: err
            })
        })
}





