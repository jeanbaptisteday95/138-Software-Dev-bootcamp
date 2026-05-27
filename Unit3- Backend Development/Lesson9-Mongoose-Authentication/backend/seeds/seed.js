const connectDB = require('../config/db');
const User = require('../models/User');
const Post = require('../models/Post');
require('dotenv').config();

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});

    console.log('Existing data cleared');

    // Seed Users
    const users = await User.insertMany([
      { name: 'Alice', email: 'alice@example.com', age: 25 },
      { name: 'Bob', email: 'bob@example.com', age: 30 },
      { name: 'Charlie', email: 'charlie@example.com', age: 35 },
      { name: 'David', email: 'david@example.com', age: 40 },
      { name: 'Eve', email: 'eve@example.com', age: 45 },
    ]);

    console.log(`${users.length} users created`);

    // Seed Posts
    const posts = await Post.insertMany([
      { title: 'Post 1', content: 'Content for post 1', user: users[0]._id },
      { title: 'Post 2', content: 'Content for post 2', user: users[1]._id },
      { title: 'Post 3', content: 'Content for post 3', user: users[2]._id },
      { title: 'Post 4', content: 'Content for post 4', user: users[3]._id },
      { title: 'Post 5', content: 'Content for post 5', user: users[4]._id },
      { title: 'Post 6', content: 'Content for post 6', user: users[0]._id },
      { title: 'Post 7', content: 'Content for post 7', user: users[1]._id },
      { title: 'Post 8', content: 'Content for post 8', user: users[2]._id },
    ]);

    console.log(`${posts.length} posts created`);

    console.log('Database seeding complete!');
    process.exit(0); // Exit the script
  } catch (error) {
    console.error('Error while seeding:', error.message);
    process.exit(1); // Exit with failure
  }
};

seedData();
