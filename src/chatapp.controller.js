"use strict";
const {
  createPost,
  createThread,
  getThreads,
  getPostsByThreadId,
  getThreadByThreadId,
  // getThreadByThreadId,
  // getUser,
  // createUser,
} = require("./chatapp.service");

const PromiseRouter = require("express-promise-router");

const router = PromiseRouter();

// HTTP POSTメソッドに対応したエンドポイントの処理を定義https://github.com/meiji-software-engineering/ex-04-team5/issues/90
// フォームからの入力を用いて新しいメッセージを作成するエンドポイント
router.post("/:threadId/post", async (req, res) => {
  // const ip = req.ip;
  // const user = await getUser(ip);
  const id = req.user.id;
  const threadId = req.params.threadId;
  const content = req.body.content;
  await createPost(id, threadId, content);
  res.redirect(`/threads/${threadId}`);
});

// スレッドの作成エンドポイント
router.post("/create", async (req, res) => {
  const id = req.user.id;
  const title = req.body.threadTitle;
  const category = req.body.threadCategory;
  await createThread(id, title, category);
  res.redirect("/threads"); // スレッド一覧ページにリダイレクト
});

// スレッド一覧を表示するエンドポイント
router.get("/", async (req, res) => {
  const threads = await getThreads();
  res.render("threads-list", { threads });
});

// 特定のスレッド内のメッセージ一覧を表示するエンドポイント
router.get("/:threadId", async (req, res) => {
  const threadId = req.params.threadId;
  const posts = await getPostsByThreadId(threadId);
  const thread = await getThreadByThreadId(threadId);
  res.render("thread-view", { posts, threadId, thread });
});

module.exports = {
  router,
};
