"use strict";
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define("user", {
    // The following specification of the 'id' attribute could be omitted
    // since it is the default.
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: null,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: null,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: null,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  });

  User.associate = (models) => {
    // User : Thread で 1:n の関係であることを示す
    User.hasMany(models.Thread, {
      foreignKey: "userId", // 対象 (thread テーブル) のカラム名を指定する
    });
    // User : Message で 1:n の関係であることを示す
    User.hasMany(models.Message, {
      foreignKey: "userId", // 対象 (message テーブル) のカラム名を指定する
    });
  };
  User.sync();
  return User;
};
