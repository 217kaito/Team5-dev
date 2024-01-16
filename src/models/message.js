"use strict";
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Message = sequelize.define("message", {
    // The following specification of the 'id' attribute could be omitted
    // since it is the default.
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: null,
    },
    content: {
      type: DataTypes.STRING,
    },
    threadId: {
      type: DataTypes.INTEGER,
      allowNull: false,
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

  Message.associate = (models) => {
    Message.belongsTo(models.Thread, {
      foreignKey: "threadId", // message.threadId のカラム名を指定する
      targetKey: "id", // 対応する thread テーブルのカラム名を指定する
    });
    Message.belongsTo(models.User, {
      foreignKey: "userId", // message.ip のカラム名を指定する
      targetKey: "id", // 対応する User テーブルのカラム名を指定する
    });
  };
  Message.sync();
  return Message;
};
