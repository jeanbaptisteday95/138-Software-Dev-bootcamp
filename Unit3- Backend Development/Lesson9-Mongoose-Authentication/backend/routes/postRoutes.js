const express = require("express");
const {
  createPost,
  getPosts,
  addComment,
  getComment,
} = require("../controllers/postController");
const { authMiddleware } = require("../middlewares/auth");

const router = express.Router();

// Route-level middleware: simple logger to demonstrate custom middleware usage.
const requestLogger = require("../middlewares/logger");
router.use(requestLogger);

router.post("/", authMiddleware, createPost);
router.get("/", getPosts);
router.get("/:postId/comments", getComment);
router.post("/:postId/comments", authMiddleware, addComment);

module.exports = router;
