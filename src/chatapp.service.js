// src/chatapp.service.js
"use strict";
const { models } = require("./models");

// メッセージの作成
const createPost = async (userid, messageThreadId, messageContent) => {
  await models.message.create({
    userId: userid,
    content: messageContent,
    threadId: messageThreadId,
  });
  await models.thread
    .findOne({ where: { id: messageThreadId } })
    .then((thread) => {
      thread.updatedAt = new Date();
      thread.changed("updatedAt", true);
      thread.save();
    });
};

// スレッドの作成
const createThread = async (userid, threadTitle) => {
  await models.thread.create({
    title: threadTitle,
    userId: userid,
  });
};

// 全てのスレッドを取得
const getThreads = async () => {
  const threads = await models.thread.findAll();
  return threads;
};

// スレッドの全てのメッセージを取得
const getPostsByThreadId = async (threadid) => {
  const messages = await models.message.findAll({
    where: { threadId: threadid },
    include: models.user,
  });
  return messages;
};

// ユーザ情報を取得
const getUserbyId = async (userId) => {
  const user = await models.user.findOne({ where: { id: userId } });
  return user;
};

const getUserbyName = async (userName) => {
  const user = await models.user.findOne({ where: { username: userName } });
  return user;
};

// ユーザ情報を作成
const createUser = async (userId, userIp, userName, userPassword) => {
  // 同じidがあれば作成しない
  const userbyid = await getUserbyId(userId);
  // 同じユーザネームがあれば作成しない
  const userbyname = await getUserbyName(userName);
  if (userbyid) {
    return false;
  }
  if (userbyname) {
    return false;
  }
  await models.user.create({
    id: userId,
    ip: userIp,
    username: userName,
    password: userPassword,
  });
  return true;
};

// ユーザ情報を更新
const updateUser = async (userId, userName, userPassword) => {
  // 同じユーザネームがあれば作成しない
  const userbyname = await getUserbyName(userName);
  console.log(userbyname);
  if (userbyname) {
    return false;
  }
  await models.user.update(
    {
      username: userName,
      userpassword: userPassword,
    },
    { where: { id: userId } },
  );
  return true;
};

module.exports = {
  createPost,
  createThread,
  getThreads,
  getPostsByThreadId,
  createUser,
  getUserbyId,
  getUserbyName,
  updateUser,
};
