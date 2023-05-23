import express from 'express';
import {graphqlHTTP} from 'express-graphql';
import mariadb from 'mariadb'
import schema from './GRAPHschema.js'

//Importation des models
import Style from './models/style.js';
import Artiste from './models/artiste.js';

import session from "express-session";
import crypto from "crypto";
import passport from "passport";
import { Strategy as OAuth2Strategy } from "passport-oauth2";

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json" assert { type: "json" };

const app = express();
const port = 8080;


passport.serializeUser((user, done) => {
    done(null, JSON.stringify(user));
});

passport.deserializeUser((user, done) => {
    done(null, JSON.parse(user));
});

app.use(
    session({
        secret: crypto.randomBytes(32).toString("hex"),
        resave: false,
        saveUninitialized: true,
    })
);

// Configure OAuth2 authentication
passport.use(
    "github",
    new OAuth2Strategy(
        {
            authorizationURL: "https://github.com/login/oauth/authorize",
            tokenURL: "https://github.com/login/oauth/access_token",
            clientID: "e88f4b255b5ffec3cbf7",
            clientSecret: "4d4335e4815acfe18e96cd5bd7b24018ce4fd8cb",
            callbackURL: "http://localhost:8080/auth/callback",
        },
        (accessToken, refreshToken, profile, done) => {
            // Handle user authentication and authorization
            // You may save the user data in your database or session
            // and call the `done` function to complete the authentication process
            done(null, profile);
        }
    )
);

// Github OAuth2 authentication route
app.use("/auth/github", passport.authenticate("github"));

// Github OAuth2 callback route
app.use(
    "/auth/callback",
    passport.authenticate("github", { failureRedirect: "/" }),
    (req, res) => {
        // Redirect to the home page after successful authentication
        res.redirect("/graphql");
    }
);

// Example protected route
app.use(
    "/protected",
    passport.authenticate("github", { session: false }),
    (req, res) => {
        // Return data only if the user is authenticated
        res.json({ message: "This is a protected route" });
    }
);

// Initialize Passport and session middleware
app.use(passport.initialize());

app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function(req, res) {
        // L'authentification a réussi, redirigez l'utilisateur vers la page souhaitée
        res.redirect('/dashboard');
    });

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

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
                return styles.map(target => target.dataValues)
            })
                .catch(error => {
                    console.error(error);
                });
        }
    },
    getAllArtiste(args) {
        // l'ensemble des artistes
        if (args.state === "basic") {
            return buildQuery("SELECT IdArtiste, Artiste.idStyle, libelle, description FROM Artiste INNER JOIN Style on Style.idStyle = Artiste.idStyle")

        } else if (args.state === "advanced") {
            return Artiste.findAll({include: [Style]}).then(artistes => {
                return artistes.map(target => target.dataValues)
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

// Swagger-UI endpoint
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use("/graphql", graphqlHTTP({
    schema: schema,
    rootValue: resolver,
    graphiql: true,
})).listen(port);