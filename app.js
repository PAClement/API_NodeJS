import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import mariadb from 'mariadb'

const app = express();
const port = 8080;

const pool = mariadb.createPool({
    host: 'http://localhost:4001/',
    user:'root',
    password: 'rootpwd',
    connectionLimit: 5
});

const schema = buildSchema(`
  type User {
    id: Int
    email: String!
    password: String!
  }
  
  type Test {
    id: Int
    email: String!
    password: String!
  }

  type Query {
    user(id: Int): User!,
    test(): Test!
  }
`)

// Maps id to User object
const usersFakeData = [
    {id: 1, email:'a@a.a',password:'zaq1@WSX'},
    {id: 2, email:'b@b.b',password:'ZAQ!2wsx'}
];

// The root provides a resolver function for each API endpoint
const resolver = {
    user(parent, args, contextValue, info) {
        return usersFakeData.find((user) => usersFakeData.id === args.id);
    },
    test(parent, args, contextValue){
        console.log(usersFakeData)
        return usersFakeData
    }
}

app.use("/graphql",  graphqlHTTP({
    schema: schema,
    rootValue: resolver,
    graphiql: true,
})).listen(port);