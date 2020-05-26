var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcryptjs");

var userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      // unique:true
    },
    password: {
      type: String,
      required: String,
    },
    bio: String,
    image: String,    
    following:[String],
    followers:[String]
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {
    if (this.password && this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 10);
      return next();
    }
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.verify = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
