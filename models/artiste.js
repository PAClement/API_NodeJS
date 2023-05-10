import {DataTypes} from "sequelize";
import sequelize from "../sequelize.js";

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
        type: DataTypes.STRING,
    }
},{
    freezeTableName: true,
    timestamps: false,
    tableName: 'Artiste'
});

export default Artiste;