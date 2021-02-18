'use strict';
const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  'postgres://postgres:postgres@localhost/blog_data'
);
module.exports = {
  database: sequelize,
  Sequelize: Sequelize
};