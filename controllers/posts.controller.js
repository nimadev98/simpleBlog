const express = require("express");
const postModel = require("../models/posts.model");
const router = express.Router();

router.get("/", async (req, res) => {
  const page = req.query.page || 1;
  const allpost = await postModel.postLength();
  const pageNumber = allpost / 5;
  const posts = await postModel.getPosts({}, 5, page);
  const user = await req.user;
  res.render("index", {
    logedin: req.logedin,
    posts: posts,
    user: user,
    pageNumber: Math.ceil(pageNumber),
  });
});

router.get("/compose", async (req, res) => {
  if (req.logedin) {
    const user = await req.user;
    res.render("compose", { logedin: req.logedin, user: user });
  } else {
    res.redirect("/login");
  }
});
router.post("/compose", async (req, res) => {
  if (req.logedin) {
    user = await req.user;
    const date = new Date();
    postModel.addPost(req.body, user, date);
    res.status(201).redirect("/");
  } else {
    res.redirect("/login");
  }
});

router.get("/myposts", async (req, res) => {
  if (req.logedin) {
    user = await req.user;
    const posts = await postModel.getPosts({ author: user.username });
    res.render("myposts", { logedin: req.logedin, posts: posts, user: user });
  } else {
    res.redirect("/");
  }
});

router.get("/posts/:id", async (req, res) => {
  const postId = req.params.id;
  const post = await postModel.getPost(postId);
  const user = await req.user;
  res.render("single", { post: post, logedin: req.logedin, user: user });
});

router.get("/delete/:id", async (req, res) => {
  if (req.logedin) {
    const post = await postModel.getPost(req.params.id);
    const user = await req.user;
    if (post.author === user.username) {
      await postModel.deletePost(post.id);
      res.redirect("/");
    } else {
      res.redirect("/");
    }
  } else {
    res.redirect("/");
  }
});
router.get("/update/:id", async (req, res) => {
  if (req.logedin) {
    const post = await postModel.getPost(req.params.id);
    const user = await req.user;
    if (post.author === user.username) {
      res.render("update", { logedin: req.logedin, post: post });
    } else {
      res.redirect("/");
    }
  } else {
    res.redirect("/");
  }
});

router.post("/update/:id", async (req, res) => {
  if (req.logedin) {
    const user = await req.user;
    const post = await postModel.getPost(req.params.id);
    if (post.author === user.username) {
      await postModel.updatePost(req.params.id, {
        title: req.body.title,
        body: req.body.body,
      });
      res.redirect("/");
    } else {
      res.redirect("/");
    }
  } else {
    res.redirect("/");
  }
});

router.post("/likeList", async (req, res) => {
  const { postId } = req.body;
  const post = await postModel.getPost(postId);
  res.json({ likes: post.likes });
});

router.post("/updateLikeList", async (req, res) => {
  await postModel.updatePost(req.body.postId, {
    likes: req.body.data,
  });
  res.json({ updated: true });
});

module.exports = router;
