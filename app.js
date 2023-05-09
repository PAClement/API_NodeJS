import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import mariadb from 'mariadb'

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

const schema = buildSchema(`
  type User {
    id: Int
    email: String
    password: String
  }
  
  type Style{
    idStyle: Int!
    libelle: String
    description: String
  }
  
  type Query {
    user(id: Int): User!,
    getAllUser: [User]!,
    getAllStyle: [Style]!
  }
`)

// Maps id to User object
const usersFakeData = [
    {id: 1, "email":'a@a.a',password:'zaq1@WSX'},
    {id: 2, "email":'b@b.b',password:'ZAQ!2wsx'}
];

// The root provides a resolver function for each API endpoint
const resolver = {
    user(parent, args, contextValue, info) {
        return usersFakeData.find((user) => user.id === parent.id);
    },
    getAllUser(parent, args, contextValue){
        return usersFakeData
    },
    async getAllStyle(){
        return await pool.getConnection()
            .then(conn => {

                return conn.query("SELECT * FROM Style")
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
}

app.use("/graphql",  graphqlHTTP({
    schema: schema,
    rootValue: resolver,
    graphiql: true,
})).listen(port);