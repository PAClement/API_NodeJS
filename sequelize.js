import {Sequelize} from "sequelize";

const sequelize = new Sequelize('liveAddict', 'root', 'rootpwd', {
    host: 'localhost',
    port: 4000,
    dialect: 'mariadb',
    logging: true
})

export default sequelize;
