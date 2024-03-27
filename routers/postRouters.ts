// @ts-nocheck
import express from "express";
import * as database from "../controller/postController";
const router = express.Router();
import { ensureAuthenticated } from "../middleware/checkAuth";
import { create } from "domain";
import { formatTimestamp } from "../utils/timestampUtils";

//get all posts
router.get("/", async (req, res) => {
  const posts = await database.getPosts(20);
  const user = await req.user;
  res.render("posts", { posts: posts, user: user });
});

//get for create post
router.get("/create", ensureAuthenticated, (req, res) => {
  res.render("createPosts");
  create();
});

//post to create post
router.post("/create", ensureAuthenticated, async (req, res) => {
  const { title, link, description, subgroup } = req.body;
  const creator = req.user.id;
  if (!title || !link || !description || !subgroup) {
    res.status(400).send("All fields are required");
  }
  const newPost = await database.addPost(
    title,
    link,
    creator,
    description,
    subgroup
  );
  res.redirect(`/posts/show/${newPost.id}`);
});

//get post by id
router.get("/show/:postid", async (req, res) => {
  const postId = req.params.postid;

  const post = await database.getPost(postId);
  const comments = post.comments || [];
  //timestamp from utils folder pass to view
  post.timestamp = formatTimestamp(post.timestamp);
  res.render("individualPost", { post, formatTimestamp, comments });
});

//get post to edit
router.get("/edit/:postid", ensureAuthenticated, async (req, res) => {
  const postId = req.params.postid;
  const userId = req.user.id;
  const post = await database.getPost(postId);
  res.render("editPost", { post, currentUser: userId });
});

//edit post
router.post("/edit/:postid", ensureAuthenticated, async (req, res) => {
  const { title, link, description } = req.body;
  const postId = req.params.postid;
  const creator = req.user.id;
  if (!title || !link || !description) {
    res.status(400).send("All fields are required");
  }
  const editPost = await database.editPost(postId, {
    creator,
    title,
    link,
    description,
  });
  res.redirect(`/posts/show/${postId}`);
});

//get post to delete
router.get("/deleteconfirm/:postid", ensureAuthenticated, async (req, res) => {
  const postId = req.params.postid;
  const userId = req.user.id;

  const post = await database.getPost(postId);
  res.render("deletePost", { post, currentUser: userId });
});

//delete post
router.post("/delete/:postid", ensureAuthenticated, async (req, res) => {
  const postId = req.params.postid;

  try {
    await database.deletePost(postId);
    res.redirect("/subs/list");
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).send("Error deleting post");
  }
});

export default router;
