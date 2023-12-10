"use strict";
const {
  createPost,
  createThread,
  getThreads,
  getPostsByThreadId,
  updateUser,
  // getUser,
  // createUser,
} = require("./chatapp.service");

const PromiseRouter = require("express-promise-router");

const router = PromiseRouter();

// HTTP POSTメソッドに対応したエンドポイントの処理を定義
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
  await createThread(id, title);
  res.redirect("/threads"); // スレッド一覧ページにリダイレクト
});

router.get("/setting", async function (req, res) {
  res.render("setting");
});

router.post("/setting", async function (req, res) {
  const user = await updateUser(
    req.user.id,
    req.body.username,
    req.body.userpassword,
  );
  if (user === true) {
    res.redirect("/threads");
  } else {
    res.redirect("/threads/setting/error");
  }
});

router.get("/setting/error", async function (req, res) {
  res.render("setting-error");
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
  res.render("thread-view", { posts, threadId });
});

module.exports = {
  router,
};
