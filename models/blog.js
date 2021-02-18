'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const Blog = loader.database.define(
  'blogs',
  {
    blogId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    blogTitle: {
      type: Sequelize.STRING,
      allowNull: false
    },
    blogText: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    createdBy: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false
    }
  },
  {
    freezeTableName: true,
    timestamps: false
  }
);

module.exports = Blog;