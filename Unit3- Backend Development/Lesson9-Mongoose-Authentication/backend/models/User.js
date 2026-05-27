const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    age: Number,
    passwordHash: { type: String, required: true },
  },
  { timestamps: true, id: false },
);

// Set a virtual password property so the consumer can assign plaintext passwords.
// The actual stored field remains `passwordHash`, which is what is persisted to MongoDB.
// This keeps the plaintext password out of the database and allows the pre-save hook
// to run hashing logic automatically.
UserSchema.virtual("password").set(function (password) {
  this._password = password;
  this.passwordHash = password;
});

// Mongoose hooks are middleware attached to model lifecycle events.
// Here, the `pre('save')` hook hashes the password before the document is stored.

UserSchema.pre("save", async function () {
  if (!this.isModified("passwordHash")) return;

  const raw = this.passwordHash;
  this.passwordHash = await bcrypt.hash(raw, 10);
});

// Static methods are called on the Model itself, not on a specific document.
// Example: User.hashPassword('secret')
UserSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

// Instance methods are available on a loaded document.
// Example: const user = await User.findOne(...); user.isValidPassword('secret')
UserSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.passwordHash);
};

UserSchema.virtual("info").get(function () {
  return `${this.name}${this.age ? ` (age ${this.age})` : ""}`;
});

UserSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("User", UserSchema);
