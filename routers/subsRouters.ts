import express from "express";
import * as database from "../controller/postController";
const router = express.Router();

router.get("/list", async (req, res) => {
  const subs = await database.getSubs(undefined);
  res.render("subs", { subs });
});

router.get("/show/:subname", async (req, res) => {
  const subname = req.params.subname;
  const subs = await database.getSub(subname);
  res.render("sub", { subname, subs });
});

export default router;
