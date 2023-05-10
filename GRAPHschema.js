import {buildSchema} from "graphql";

const schema = buildSchema(`

  type Style{
    idStyle: Int!
    libelle: String
    description: String
  }
  
  type Artiste{
    IdArtiste: Int!
    pseudo: String
    idStyle: Int
  }
  
  type Query {
    getAllStyle(state: String): [Style]!
    getAllArtiste: [Artiste]!
  }
`)

export default schema