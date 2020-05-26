var express = require("express");
var router = express.Router();
var User = require("../model/user");
var auth = require("../middlewares/auth");
var Article = require("../model/article");

//register user
exports.register = async (req, res, next) => {
  try {
    var user = await User.create(req.body.user, user);
    var token = await auth.generateToken(user);
    console.log(token);
    res.json({ Success: "user created successfully" });
  } catch (error) {
    next(error);
  }
};

//user login
exports.login = async (req, res, next) => {
  var { email, password } = req.body.user;
  if (!email || !password) {
    res.json("Email/Password is required");
  }
  try {
    var user = await User.findOne({ email });
    if (!user) {
      res.json("Email is Invalid");
    }
    if (!user.verify(password)) {
      res.json("password is invalid");
    }
    var token = await auth.generateToken(user);
    res.json({
      email: user.email,
      id: user.id,
      username: user.username,
      token,
    });
  } catch (error) {
    console.log(error, "dkdj");
    next(error);
  }
};

// get current user

exports.currentUser = async (req, res, next) => {
  try {
    var user = await User.findById(req.user.userId);
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

// update current user
exports.updateUser = async (req, res, next) => {
  console.log(req.body.user);
  try {
    var updtaedUser = await User.findByIdAndUpdate(
      req.user.userId,
      req.body.user,
      { new: true }
    );
    res.json({ updtaedUser });
  } catch (error) {
    next(error);
  }
};

//get  other user profile
exports.profile = async (req, res, next) => {
  try {
    let user = await User.findOne({ username: req.params.username });
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

// follow user by username

exports.follow = async (req, res, next) => {
  try {
    let localuser = await User.findOneAndUpdate(
      { username: req.params.username },
      { $addToSet: { followers: req.user.userId } },
      { new: true }
    );
    let cuser = await User.findByIdAndUpdate(
      req.user.userId,
      { $addToSet: { following: localuser.id } },
      { new: true }
    );
    res.json({
      user: {
        username: localuser.username,
        bio: localuser.bio,
        image: localuser.image,
        following: localuser.followers.includes(req.user.userId),
      },
    });
  } catch (error) {
    next(error);
  }
};

// unfollow user
exports.unfollow = async (req, res, next) => {
  try {
    let localuser = await User.findOneAndUpdate(
      {
        username: req.params.username,
      },
      { $pull: { followers: req.user.userId } },
      { new: true }
    );
    let cuser = await User.findByIdAndUpdate(
      req.user.userId,
      { $pull: { following: localuser.id } },
      { new: true }
    );
    res.json({
      user: {
        username: localuser.username,
        bio: localuser.bio,
        image: localuser.image,
        following: localuser.followers.includes(req.user.userId),
      },
    });
  } catch (error) {
    next(error);
  }
};

// list of all tags in articles
exports.tags = async (req, res, next) => {
  let tags = await Article.distinct("tags");
  console.log(tags, "tagsh");
  res.json({ tags: tags });
};
