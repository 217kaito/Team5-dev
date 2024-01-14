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
const createThread = async (userid, threadTitle, threadCategory) => {
  await models.thread.create({
    title: threadTitle,
    userId: userid,
    category: threadCategory,
  });
};

// スレッドIDからスレッド情報を取得
const getThreadByThreadId = async (threadId) => {
  const thread = await models.thread.findOne({
    where: { id: threadId },
  });
  return thread;
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
const getUserById = async (userId) => {
  const user = await models.user.findOne({ where: { id: userId } });
  return user;
};

const getUserByName = async (userName) => {
  const user = await models.user.findOne({ where: { username: userName } });
  return user;
};

const createUser = async (userId, userIp, userName, userPasswordHash) => {
  await models.user.create({
    id: userId,
    ip: userIp,
    username: userName,
    passwordHash: userPasswordHash,
  });
};

// ユーザ情報を更新
const updateUser = async (userId, userName, userPassword) => {
  // 同じユーザネームがあれば作成しない
  const userbyname = await getUserByName(userName);
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
  getThreadByThreadId,
  createUser,
  getUserById,
  getUserByName,
  updateUser,
};
