import express from 'express';
import {graphqlHTTP} from 'express-graphql';
import mariadb from 'mariadb'
import schema from './GRAPHschema.js'

//Importation des models
import Style from './models/style.js';
import Artiste from './models/artiste.js';

const app = express();
const port = 8080;

const pool = mariadb.createPool({
    host: 'localhost',
    port: 4000,
    user: 'root',
    password: 'rootpwd',
    database: 'liveAddict',
    connectionLimit: 5
});

const buildQuery = async (query) => {
    return await pool.getConnection()
        .then(conn => {
            return conn.query(query)
                .then((rows) => {
                    conn.end();
                    return rows
                })
                .catch(err => {
                    //handle error
                    console.log(err);
                    conn.end();
                })
        }).catch(err => {
            //not connected
            console.log(err);
        });
}

//===========================================================

//Le paramètre state permet de changer le mode de requête
// State = basic : C'est des requête sans ORM
// State = advanced : C'est les requêtes avec ORM (Sequelize)

//===========================================================

// The root provides a resolver function for each API endpoint
const resolver = {
    getAllStyle(args) {
        // l'ensemble des styles
        if (args.state === "basic") {

            return buildQuery("SELECT * FROM Style")
        } else if (args.state === "advanced") {

            return Style.findAll().then(styles => {
                    return styles.map(target =>  target.dataValues)
                })
                .catch(error => {
                    console.error(error);
                });
        }
    },
    getAllArtiste(args) {
        // l'ensemble des artistes
        if (args.state === "basic") {
            return buildQuery("SELECT IdArtiste, pseudo, Artiste.idStyle, libelle, description FROM Artiste INNER JOIN Style on Style.idStyle = Artiste.idStyle")
        } else if (args.state === "advanced") {
            return Artiste.findAll({ include: [Style] }).then(artistes => {
                return artistes.map(target =>  target.dataValues)
            })
                .catch(error => {
                    console.error(error);
                });
        }
    },
    getConcertByTown(args) {
        // l'ensemble des concerts d'une ville

    },
    getVisitorByTown(args) {
        // L'ensemble des visiteurs d'une ville

    },
    getConcertByArtiste(args) {
        // l'ensemble des concerts d'un artiste

    },
    getConcertByStyleByTown(args) {
        // l'ensemble des concerts d'un style pour une ville

    },
    getProportionOfStyle(args) {
        // La proportion des styles écoutés par ville

    }
}

app.use("/graphql", graphqlHTTP({
    schema: schema,
    rootValue: resolver,
    graphiql: true,
})).listen(port);