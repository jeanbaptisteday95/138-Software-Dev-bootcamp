const Post = require('../models/Post');
const User = require('../models/User');

// Create a new post
const createPost = async (req, res) => {
  try {
    const { userId, title, content } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const post = new Post({ user: userId, title, content });
    await post.save();

    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all posts with user details
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'name email');
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {createPost, getPosts};
