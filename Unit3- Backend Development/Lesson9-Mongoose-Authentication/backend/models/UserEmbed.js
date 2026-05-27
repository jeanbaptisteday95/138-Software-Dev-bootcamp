const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  // Embedded posts: these are subdocuments stored inside the user document.
  posts: [
    {
      title: String,
      content: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("UserEmbed", UserSchema);
