'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const User = loader.database.define(
  'users',
  {
    userId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    username: {
      type: Sequelize.STRING,
      unique: {
        msg: "その名前は使えません"
      },
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "名前は必ず入力してください"
        }
      }
    },
    password: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "パスワードは必ず入力してください"
        },
        notNull: {
          msg: "パスワードは必ず入力してください"
        }
      }
    }
  },
  {
    freezeTableName: true,
    timestamps: false
  }
);

module.exports = User;