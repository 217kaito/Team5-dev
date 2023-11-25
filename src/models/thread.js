"use strict";
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Thread = sequelize.define("thread", {
    // The following specification of the 'id' attribute could be omitted
    // since it is the default.
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      primaryKey: true,
      autoIncrement: true,
    },
    ip: {
      type: DataTypes.INTEGER,
      allowNull: null,
    },
    title: {
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

  // thread : message で 1:n の関係であることを示す
  Thread.associate = (models) => {
    Thread.hasMany(models.Message, {
      foreignKey: "threadId", // 対象 (message テーブル) のカラム名を指定する
    });
  };
  Thread.sync();
  return Thread;
};
