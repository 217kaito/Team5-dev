"use strict";
const {
  createPost,
  createThread,
  getThreads,
  getPostsByThreadId,
  getThreadByThreadId,
  updateUser,
  deletePost,
  deleteReply,
  replyPost,
  // getThreadByThreadId,
  // getUser,
  // createUser,
} = require("./chatapp.service");

const bcrypt = require("bcrypt");
const passwordSaltRounds = 10;

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

router.post("/:threadId/post/:postid", async (req, res) => {
  const id = req.user.id;
  const threadId = req.params.threadId;
  const postId = req.params.postid;
  const content = req.body.replycontent;
  await replyPost(id, threadId, postId, content);
  res.redirect(`/threads/${threadId}`);
});

router.delete("/:threadId/post/:postid", async (req, res) => {
  const id = req.user.id;
  const threadId = req.params.threadId;
  const postId = req.params.postid;
  // const posts = await getPostsByThreadId(threadId);
  await deletePost(id, postId);
  res.redirect(`/threads/${threadId}`);
});

router.delete("/:threadId/reply/:replyid", async (req, res) => {
  const id = req.user.id;
  const threadId = req.params.threadId;
  const replyId = req.params.replyid;
  await deleteReply(id, replyId);
  res.redirect(`/threads/${threadId}`);
});

// スレッドの作成エンドポイント
router.post("/create", async (req, res) => {
  const id = req.user.id;
  const title = req.body.threadTitle;
  const category = req.body.threadCategory;
  const content = req.body.threadContent;
  await createThread(id, title, category, content);
  res.redirect("/threads"); // スレッド一覧ページにリダイレクト
});

router.get("/setting", async function (req, res) {
  const stat = req.query.stat;
  if (stat === "success") {
    return res.render("setting", {
      message: { info: "user情報を更新しました。" },
    });
  } else if (stat === "failed") {
    return res.render("setting", {
      message: { error: "すでに登録されているuser名です。" },
    });
  } else {
    return res.render("setting", { message: {} });
  }
});

router.put("/setting", async function (req, res) {
  const password = req.body.password;
  const username = req.body.username;
  if (!username.match(/^.{1,16}$/)) {
    return res.status(400).send("invalid username");
  }
  if (!password.match(/^.{8,16}$/)) {
    return res.status(400).send("invalid password");
  }

  const passwordHash = await bcrypt.hash(password, passwordSaltRounds);

  const user = await updateUser(req.user.id, username, passwordHash);
  if (user === true) {
    res.redirect("/threads/setting?stat=success");
  } else {
    res.redirect("/threads/setting?stat=failed");
  }
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
  const userid = req.user.id;
  res.render("thread-view", { posts, threadId, thread, userid });
});

module.exports = {
  router,
};
