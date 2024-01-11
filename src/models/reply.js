"use strict";
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Reply = sequelize.define("reply", {
    // The following specification of the 'id' attribute could be omitted
    // since it is the default.
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    messageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
  });

  // message : reply で 1:n の関係であることを示す
  Reply.associate = (models) => {
    Reply.belongsTo(models.Message, {
      foreignKey: "messageId", // 対象 (message テーブル) のカラム名を指定する
      targetKey: "id",
    });
    Reply.belongsTo(models.User, {
      foreignKey: "userId", // user.id のカラム名を指定する
      targetKey: "id", // 対応する User テーブルのカラム名を指定する
    });
  };
  Reply.sync();
  return Reply;
};
