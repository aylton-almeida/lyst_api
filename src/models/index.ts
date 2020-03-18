import { Sequelize } from 'sequelize';
const envConfigs = require('../config/config');

const env: string = process.env.NODE_ENV || 'development';
const config = envConfigs[env];

let sequelizeInstance: Sequelize;
if (config.url) sequelizeInstance = new Sequelize(config.url, config);
else sequelizeInstance = new Sequelize(config.database, config);

export default sequelizeInstance;
