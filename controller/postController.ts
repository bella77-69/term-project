import * as db from "../fake-db";

// Make calls to your db from this file!
async function getPosts(n = 5, sub = undefined) {
  return db.getPosts(n, sub);
}

async function getPost(id: string) {
  return db.getPost(id);
}

//edit post
async function editPost(id: string, changes: object) {
  return db.editPost(id, changes);
}

//create post
async function addPost(title: string, link: string, creator: number, description: string, subgroup: string) {
  return db.addPost(title, link, creator, description, subgroup);
}

//delete post
async function deletePost(userId: string) {
  return db.deletePost(userId);
}

//get subs list
async function getSubs(n = 5, sub = undefined) {
    return db.getSubs();
}

//get posts in sub
async function getSub(subname: string) {
  return db.getPosts().filter((post) => post.subgroup === subname);
}

//create comment
async function addComment(postId: string, creator: number, description: string) {
  return db.addComment(postId, creator, description);
}

//get comment by id
async function getComment(commentId: string) {
  return db.getComment(commentId);
}

//delete comment
async function deleteComment(commentId: string) {
  return db.deleteComment(commentId);
}

//get votes for post
async function getVotesForPost(post_id: string) {
  return db.getVotesForPost(post_id);
}

//decorate post
async function decoratePost(post: any) {
  return db.decoratePost(post);
}

export { getPosts, getPost, editPost, addPost, deletePost, getSubs, getSub, addComment, getComment, deleteComment, getVotesForPost, decoratePost};
