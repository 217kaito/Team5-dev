"use strict";
const {
  createPost,
  createThread,
  getThreads,
  getPostsByThreadId,
} = require("./chatapp.service");

const PromiseRouter = require("express-promise-router");

const router = PromiseRouter();

// HTTP POSTメソッドに対応したエンドポイントの処理を定義
// フォームからの入力を用いて新しいメッセージを作成するエンドポイント
router.post("/thread/:threadId/post", async (req, res) => {
  const ip = req.ip;
  const threadId = req.params.threadId;
  const content = req.body.content;
  await createPost(ip, threadId, content);
  res.redirect(`/threads/${threadId}`);
});

// スレッドの作成エンドポイント
router.post("/threads/create", async (req, res) => {
  const ip = req.ip;
  const title = req.body.title;
  await createThread(ip, title);
  res.redirect("/threads"); // スレッド一覧ページにリダイレクト
});

// スレッド一覧を表示するエンドポイント
router.get("/threads", async (req, res) => {
  const threads = await getThreads();
  res.render("threads-list", { threads });
});

// 特定のスレッド内のメッセージ一覧を表示するエンドポイント
router.get("/threads/:threadId", async (req, res) => {
  const threadId = req.params.threadId;
  const posts = await getPostsByThreadId(threadId);
  res.render("thread-view", { posts });
});

module.exports = {
  router,
};
