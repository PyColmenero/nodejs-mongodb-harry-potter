// const res = require('express/lib/response');
const express = require('express');
const app = express();
const path = require("path");
const fs = require("fs");
require('dotenv').config();

// MONGO DATA BASE
const mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
const uri = process.env.MONGODB_URI;


let global_req;
let global_res;
let response = {};

var body_parser = require('body-parser');
app.use(body_parser.urlencoded({ extended: true }));
// ASIGNAR PUERTO
// puerto
const port = 777;
app.set('port', port);
app.listen(app.get('port'), () => {
    console.log("Server running on localhost:" + app.get('port'));
})


// RUTAS no HTML, archivos solicitados JS, CSS, IMG...
app.use(express.static(__dirname));

// cada una de las RUTAS HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + "/src/views/harry.html"));
});
// cada una de las RUTAS HTML
app.get('/importar', (req, res) => {

    res.sendFile(__dirname + "/src/views/importar.html");

});
app.get('/importarDDBB', (req, res) => {

    global_req = req;
    global_res = res;
    response = {};
    response.inserts = [];
    createDatabase("harry");

});

app.post('/find', (req, res) => {

    global_req = req;
    global_res = res;

    findAll("harry", "personajes");

});
app.get('/delete', (req, res) => {

    global_req = req;
    global_res = res;
    let name = global_req.query.name;

    if (name) deleteCharacter("harry", "personajes", name);

});
app.post('/new', (req, res) => {

    global_req = req;
    global_res = res;

    let character = global_req.body;
    console.log(character);
    character.wand = { wood: character.wood, core: character.core, length: character.length }
    delete character.wood;
    delete character.core;
    delete character.length;
    character.hogwartsStudient = (character.hogwartsStudient == "true");
    character.hogwartsStudient = (character.hogwartsStudient == "true");
    character.alive = (character.alive == "true");
    character.yearOfBirth = parseInt(character.yearOfBirth);

    response = {};
    response.inserts = [];
    insert("harry", "personajes", [character]);





});

// RUTAS ERROR 404
app.use(function(req, res) {
    res.status(404).sendFile(path.join(__dirname + "/src/views/404.html"));
});

// FUNCIONES
function deleteCharacter(databaseName, collectionName, name) {

    MongoClient.connect(uri + databaseName, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db(databaseName);
        var myquery = { name: name };
        dbo.collection(collectionName).deleteOne(myquery, function(err, result) {
            if (err) throw err;
            global_res.send({ name: name, ok: result.deletedCount == 1 });
            db.close();
        });
    });
}

function findAll(databaseName, collectionName) {
    MongoClient.connect(uri + databaseName, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db(databaseName);

        let filterCode = global_req.body.filter;
        let filter = {};

        switch (filterCode) {
            case "0":
                filter = { "species": "human" };
                break;
            case "1":
                filter = { yearOfBirth: { $lt: 1979 } };
                break;
            case "2":
                filter = { "wand.wood": "holly" };
                break;
            case "3":
                filter = { "alive": true, "hogwartsStudent": true };
                break;
            default:
                break;
        }

        dbo.collection(collectionName).find(filter).toArray(function(err, result) {
            if (err) throw err;

            global_res.send(result);

            db.close();
        });
    });
}

function createDatabase(databaseName) {

    MongoClient.connect(uri + databaseName, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
        if (err) {
            throw err;
        }

        response.ddbb = "Base de datos " + databaseName + " creada correctamente.";

        createCollection("harry", "personajes");

        db.close();
    });

}

function createCollection(databaseName, collectionName) {

    MongoClient.connect(uri + databaseName, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
        if (err) {
            throw err;
        }
        var dbo = db.db(databaseName);
        dbo.createCollection(collectionName, function(err, res) {
            if (err) {
                if (err.code == 48) {
                    response.collection = "Colección " + collectionName + " creada!";
                    insertJSON("harry", "personajes", "harry-potter-characters.json");
                } else {
                    throw err;
                }
            } else {
                insertJSON("harry", "personajes", "harry-potter-characters.json");
                response.collection += "Colección " + collectionName + " creada!";
                db.close();
            }

        });
    });
}

function insert(databaseName, collectionName, file) {




    // if (false)
    MongoClient.connect(uri + databaseName, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db(databaseName);


        dbo.collection(collectionName).find({}).toArray(function(err, everyCharacter) {
            if (err) throw err;

            let amount = 0;
            let index = 0;

            for (let x = 0; x < file.length; x++) {

                let found = false;
                for (let y = 0; y < everyCharacter.length; y++) {
                    if (everyCharacter[y].name == file[x].name) {
                        found = true;
                        break;
                    }
                }
                console.log(found, amount);
                if (!found) {
                    amount++;

                    dbo.collection(collectionName).insertOne(file[x], function(err, res) {
                        if (err) throw err;
                        response.inserts.push("Se ha insertado '" + file[x].name + "' correctamente.");

                        if (amount == ++index) { // ESTO SIGNIFICA QUE ES LA ÚLTIMA INSERCCIÓN
                            global_res.send(response);
                            db.close();
                        }

                    });
                }

            }

            if (amount == 0) {
                global_res.send(response);
                db.close();
            }


        });


    });

}

function insertJSON(databaseName, collectionName, filename) {
    fs.readFile(filename, 'utf8', function(err, data) {
        if (err) throw err;
        var json = JSON.parse(data);
        insert(databaseName, collectionName, json);
    });
}