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

// 投稿の作成
const replyPost = async (userid, postThreadId, postMessageId, postContent) => {
  await models.reply.create({
    userId: userid,
    content: postContent,
    messageId: postMessageId,
  });
  await models.thread
    .findOne({ where: { id: postThreadId } })
    .then((thread) => {
      thread.updatedAt = new Date();
      thread.changed("updatedAt", true);
      thread.save();
    });
};

// 投稿の削除
const deletePost = async (userid, postid) => {
  await models.message
    .findOne({ where: { id: postid }, include: models.user })
    .then((message) => {
      // console.log(message.user.id);
      if (userid === message.user.id) {
        message.destroy();
      }
    });
};

const getPost = async (postid) => {
  const post = await models.message.findOne({
    where: { id: postid },
    include: models.user,
  });
  return post;
};

// スレッドの作成
const createThread = async (
  userid,
  threadTitle,
  threadCategory,
  threadContent,
) => {
  await models.thread.create({
    title: threadTitle,
    userId: userid,
    category: threadCategory,
    content: threadContent,
  });
};

const getReply = async () => {
  const reply = await models.reply.findAll();
  return reply;
};

// 返信の削除
const deleteReply = async (userid, replyid) => {
  await models.reply
    .findOne({ where: { id: replyid }, include: models.user })
    .then((reply) => {
      if (userid === reply.user.id) {
        reply.destroy();
      }
    });
};

// スレッドIDからスレッド情報を取得
const getThreadByThreadId = async (threadId) => {
  const thread = await models.thread.findByPk(threadId);
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
    where: {
      threadId: threadid,
    },
    include: [
      {
        model: models.user,
      },
      {
        model: models.reply,
        include: [
          {
            model: models.user,
          },
        ],
        order: [["id", "ASC"]], // id順にソート
        logging: console.log, // デバッグログをコンソールに出力
      },
    ],
  });
  return messages;
};

// ユーザ情報を取得
const getUser = async (userId) => {
  const user = await models.user.findOne({ where: { id: userId } });
  return user;
};

const getUserbyName = async (userName) => {
  const user = await models.user.findOne({ where: { username: userName } });
  return user;
};

// ユーザ情報を作成(ユーザ認証するのかな？)
const createUser = async (userId, userIp, userName, userPasswordHash) => {
  await models.user.create({
    id: userId,
    ip: userIp,
    username: userName,
    passwordHash: userPasswordHash,
  });
};

// ユーザ情報を更新
const updateUser = async (userId, userName, userPasswordHash) => {
  // 同じユーザネームがあれば作成しない
  const userbyname = await getUserbyName(userName);
  // console.log(userbyname);
  if (userbyname) {
    return false;
  }
  await models.user.update(
    {
      username: userName,
      passwordHash: userPasswordHash,
    },
    { where: { id: userId } },
  );
  return true;
};

module.exports = {
  createPost,
  replyPost,
  getPost,
  createThread,
  getThreadByThreadId,
  getThreads,
  getPostsByThreadId,
  createUser,
  getUser,
  getUserbyName,
  getReply,
  deleteReply,
  deletePost,
  updateUser,
};
