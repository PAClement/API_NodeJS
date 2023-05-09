import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import mariadb from 'mariadb'
import schema from './GRAPHschema.js'

const app = express();
const port = 8080;

const pool = mariadb.createPool({
    host: 'localhost',
    port: 4000,
    user:'root',
    password: 'rootpwd',
    database: 'liveAddict',
    connectionLimit: 5
});

async function selectAll(name){
    return await pool.getConnection()
        .then(conn => {
            return conn.query(`SELECT * FROM ${name}`)
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

// The root provides a resolver function for each API endpoint
const resolver = {
    getAllStyle(){
        return selectAll("Style")
    },
    getAllArtiste(){
        return selectAll("Artiste")
    }
}

app.use("/graphql",  graphqlHTTP({
    schema: schema,
    rootValue: resolver,
    graphiql: true,
})).listen(port);