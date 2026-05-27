const mongoose = require("mongoose");


// Post schema with timestamps
// 
const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        body: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true, id:false },
);

// Virtuals are computed properties available on the document but not persisted.
PostSchema.virtual("shortContent").get(function () {
  if (!this.content) return "";
  return this.content.length > 20
    ? this.content.slice(0, 17) + "..."
    : this.content;
});


// Ensure virtuals are included when you send a json response
PostSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Post", PostSchema);
