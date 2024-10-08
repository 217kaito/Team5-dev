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
    userId: {
      type: DataTypes.STRING,
      allowNull: null,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: null,
    },
    content: {
      type: DataTypes.STRING,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  // thread : message で 1:n の関係であることを示す
  Thread.associate = (models) => {
    Thread.hasMany(models.Message, {
      foreignKey: "threadId", // 対象 (message テーブル) のカラム名を指定する
    });
    Thread.belongsTo(models.User, {
      foreignKey: "userId", // user.id のカラム名を指定する
      targetKey: "id", // 対応する User テーブルのカラム名を指定する
    });
  };
  Thread.sync();
  return Thread;
};
