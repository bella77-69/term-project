// @ts-nocheck
import express, { Request, Response } from "express";
import * as database from "../controller/postController";
const router = express.Router();
import { ensureAuthenticated } from "../middleware/checkAuth";
import { formatTimestamp } from "../utils/timestampUtils";

//get comments by post id
router.get("/show/:postid", async (req, res) => {
  const postId = req.params.postid;
  const post = await database.getPost(postId);
  const comments = post.comments || [];
  const creator = req.user.id;
  //timestamp from utils folder pass to view
  post.timestamp = formatTimestamp(post.timestamp);
  res.render("comments", { comments, postId, post, formatTimestamp, creator });
});

//post to create comment
router.post(
  "/comment-create/:postid",
  ensureAuthenticated,
  async (req, res) => {
    const postId = req.params.postid;
    const creator = req.user.id;
    const { description } = req.body;
    if (!description) {
      res.status(400).send("All fields are required");
    }
    //generate timestamp
    const timestamp = Date.now();
    //format timestamp and pass to db
    const formattedDate = formatTimestamp(timestamp);
    const addComment = await database.addComment(
      postId,
      creator,
      description,
      formattedDate
    );
    res.redirect(`/comments/show/${postId}`);
  }
);

//get comment by id to delete
router.get(
  "/comment-delete/:postid/:commentid",
  ensureAuthenticated,
  async (req, res) => {
    const postId = req.params.postid;
    const commentId = req.params.commentid;
    const userId = req.user.id;
    const comment = await database.getComment(commentId);
    res.render("deleteComment", { comment, postId, currentUser: userId });
  }
);

//delete comment
router.post(
  "/comment-delete/:postid/:commentid",
  ensureAuthenticated,
  async (req, res) => {
    const postId = req.params.postid;
    const commentId = req.params.commentid;

    try {
      await database.deleteComment(commentId);
      res.redirect(`/comments/show/${postId}`);
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).send("Error deleting comment");
    }
  }
);

export default router;
