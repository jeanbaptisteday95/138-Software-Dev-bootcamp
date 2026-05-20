const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    posts: [
      {
        title: String,
        content: String,
      },
    ],
  });
  