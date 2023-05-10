# MDS express API

## Technologies 
    Express
    Sequelize
    NodeJS
    GraphQL

## Les requêtes

Pour toutes les requêtes demandées, j'ai mis en place 2 façons
de les faire.

Lors d'une requêtre, par exemple pour récupérer tous les styles

    getAllStyle(args){
        // l'ensemble des styles
        if(args.state === "basic"){
            return buildQuery("SELECT * FROM Style")
        }else if(args.state === "advanced"){
            return true
        }
    },

Il y a l'argument **state** qui permet de faire la requête soit
avec l'ORM ou avec une requête SQL Basic
    
    Sans ORM

    {
        getAllStyle(state: "basic"){
        idStyle
        }
    }

    ----------------------------

    Avec ORM

    {
        getAllStyle(state: "advanced"){
        idStyle
        }
    }