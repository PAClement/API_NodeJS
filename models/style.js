import {DataTypes} from "sequelize";
import sequelize from "../sequelize.js";
import Artiste from "./artiste.js";

const Style = sequelize.define('Style', {
    // Model attributes are defined here
    idStyle: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    libelle: {
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.STRING,
    }
},{
    freezeTableName: true,
    timestamps: false,
    tableName: 'Style'
});


export default Style;