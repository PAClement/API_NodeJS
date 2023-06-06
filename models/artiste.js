import {DataTypes} from "sequelize";
import sequelize from "../sequelize.js";
import Style from "./style.js";

const Artiste = sequelize.define('Artiste', {
    // Model attributes are defined here
    IdArtiste: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    pseudo: {
        type: DataTypes.STRING,
    },
    idStyle: {
        type: DataTypes.INTEGER,
        foreignKey: true
    },
},{
    freezeTableName: true,
    timestamps: false,
    tableName: 'Artiste'
});

export default Artiste;