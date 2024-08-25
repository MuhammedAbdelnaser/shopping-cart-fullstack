
const Sequelize = require('sequelize');

const sequelize = new Sequelize('ecommerce-node', 'root', 'new_password', {
  host: 'localhost',
  dialect: 'mysql'
})

module.exports = sequelize