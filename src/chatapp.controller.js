"use strict";
const {
  createMessage,
  markMessageAsReplied,
  unmarkMessageAsReplied,
  generateMassageId,
  createThread,
  getThreads,
  getMessagesInThread,
} = require("./chatapp.service");

const PromiseRouter = require("express-promise-router");

const router = PromiseRouter();

// HTTP POSTメソッドに対応したエンドポイントの処理を定義
// フォームからの入力を用いて新しいメッセージを作成するエンドポイント
// 入力が増える可能性もあることから、オブジェクトを利用
router.post("/add", async (req, res) => {
  const message = {
    id: generateMessageId(),
    name: req.body.name,
    title: req.body.title,
    content: req.body.message,
    timestamp: timestamp,
  };

  await createMessage(message);
  res.redirect("/");
});

// 新しいメッセージの投稿画面を表示するエンドポイント
router.get("/add", (req, res) => {
  res.render("add");
});

// メッセージを返信済みにするエンドポイント
router.get("/replied/:id", async (req, res) => {
  await markMessageAsReplied(parseInt(req.params.id, 10));
  res.redirect("/");
});

// メッセージを未返信にするエンドポイント
router.get("/unreplied/:id", async (req, res) => {
  await unmarkMessageAsReplied(parseInt(req.params.id, 10));
  res.redirect("/");
});

// スレッドの作成エンドポイント
router.post("/createThread", async (req, res) => {
  const threadName = req.body.threadName;
  await createThread(threadName);
  res.redirect("/threads"); // スレッド一覧ページにリダイレクト
});

// スレッド一覧を表示するエンドポイント
router.get("/threads", async (req, res) => {
  const threads = await getThreads();
  res.render("threads", { threads });
});

// 特定のスレッド内のメッセージ一覧を表示するエンドポイント
router.get("/threads/:threadId", async (req, res) => {
  const threadId = req.params.threadId;
  const messages = await getMessagesInThread(threadId);
  res.render("threadMessages", { messages, threadId });
});

module.exports = {
  router,
};
