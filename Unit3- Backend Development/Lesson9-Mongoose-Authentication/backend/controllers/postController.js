const Post = require("../models/Post");
const User = require("../models/User");

// Create a new post using the authenticated user id.
const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const post = new Post({ user: userId, title, content });
    await post.save();

    const populated = await Post.findById(post._id).populate(
      "user",
      "name email",
    );
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { body } = req.body;
    const userId = req.userId;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    // userId comes from authMiddleware, not from client body.
    post.comments.push({ user: userId, body });
    await post.save();

    const populated = await Post.findById(postId).populate(
      "comments.user",
      "name email",
    );
    res.status(201).json(populated.comments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getComment = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const populated = await post.populate(
      "comments.user",
      "name email age -_id",
    );
    res.status(200).json(populated.comments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("comments.user", "name email");
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createPost, getPosts, addComment, getComment };
