"use strict";

// src/chatapp.service.js
"use strict";
const { models } = require("./models");

// メッセージの作成
const createPost = async (messageIp, messageThreadId, messageContent) => {
  await models.message.create({
    ip: messageIp,
    content: messageContent,
    threadId: messageThreadId,
  });
  await models.thread.findOne({ id : messageThreadId }).then(thread => {
    thread.updatedAt = new Date();
    thread.changed("updatedAt", true);
    thread.save();
  });
};

// スレッドの作成
const createThread = async (threadIp, threadTitle) => {
  await models.thread.create({
    ip: threadIp,
    title: threadTitle,
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
  });
  return messages;
};

module.exports = {
  createPost,
  createThread,
  getThreads,
  getPostsByThreadId,
};
