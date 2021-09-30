const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: String,
  body: String,
  date: Date,
  author: String,
  likes: Array,
  img: String,
});

const Post = new mongoose.model("Post", postSchema);

async function addPost(post, author, date) {
  const newPost = new Post({
    title: post.title,
    body: post.body,
    date: date,
    author: author.username,
    likes: [],
    img: author.img,
  });

  await newPost.save();
}

async function postLength() {
  return (await Post.find({})).length;
}

async function getPosts(option = {}, limit = 0, page = 1) {
  const skip = (page - 1) * limit;
  const posts = await Post.find(option)
    .sort({ date: -1 })
    .skip(skip)
    .limit(limit);

  return posts;
}
async function getPost(id) {
  return await Post.findById(id);
}

async function deletePost(id) {
  await Post.deleteOne({ _id: id });
}
async function updatePost(id, content) {
  await Post.updateOne({ _id: id }, content);
}

module.exports = {
  postLength,
  addPost,
  getPosts,
  getPost,
  deletePost,
  updatePost,
};
