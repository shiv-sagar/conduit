var Article = require("../model/article");
var User = require("../model/user");
var Comment = require("../model/comment");
var slug = require("slug");

// list of all articles
exports.list = async (req, res, next) => {
  try {
    if (req.query.author) {
      let authorUser = await User.findOne({ username: req.query.author });
      let articles = await Article.find({ author: authorUser.id }).populate({
        path: "author",
        select: "username bio",
      });
      res.json({ articles });
    } else if (req.query.tag) {
      let articles = await Article.find({ tags: req.query.tag }).populate({
        path: "author",
        select: "username bio",
      });
      res.json({ articles });
    } else if (req.query.favorited) {
      let user = await User.findOne({ username: req.query.favorited });
      let articles = await Article.find({ favorited: user.id })
        .populate({ path: "author", select: "username bio" })
        .exec();
      res.json({ articles });
    } else if (req.query.limit) {
      let articles = await Article.find({})
        .populate({ path: "author", select: "username bio" })
        .limit(Number(req.query.limit));
      res.json({ articles });
    } else {
      let articles = await Article.find({})
        .populate({ path: "author", select: { username: 1, bio: 1 } })
        .sort({ updatedAt: -1 });
      res.json({ articles });
    }
  } catch (error) {
    next(error);
  }
};

// feed article
exports.feed = async (req, res, next) => {
  try {
    let user = await User.findById(req.user.userId);
    let articles = await Article.find({ author: { $in: user.following } })
      .sort({ updatedAt: -1 })
      .limit(2);
    res.json({ articles });
  } catch (error) {
    next(error);
  }
};

// new article
exports.create = async (req, res, next) => {
  try {
    req.body.article.author = req.user.userId;
    console.log(req.body, "body");
    var article = await Article.create(req.body.article);
    console.log(article, "article");
    res.json({ article });
  } catch (error) {
    next(error);
  }
};

// get single article
exports.get = async (req, res, next) => {
  try {
    let article = await Article.findOne({ slug: req.params.slug })
      .populate({ path: "author", select: "username bio" })
      .exec();
    res.json({ article });
  } catch (error) {
    next(error);
  }
};

//update article
exports.update = async (req, res, next) => {
  try {
    body = req.body.article;
    if (body.title) {
      body.slug = slug(body.title, { lower: true }) + Date.now();
    }
    let article = await Article.findOneAndUpdate(
      { slug: req.params.slug },
      req.body.article,
      { new: true }
    );
    res.json({ article });
  } catch (error) {
    next(error);
  }
};

//delete article

exports.delete = async (req, res, next) => {
  try {
    let article = await Article.findOneAndDelete({ slug: req.params.slug });
    res.json({ Success: "Article Deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// favorite article
exports.favorite = async (req, res, next) => {
  console.log("we are in");
  try {
    let article = await Article.findOneAndUpdate(
      { slug: req.params.slug },
      {
        $inc: { favoritesCount: 1 },
        $addToSet: { favorited: req.user.userId },
      },
      { new: true }
    );
    article.favorited = article.favorited.includes(req.user.userId);
    res.json({ article });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// unfavorite article
exports.unfavorite = async (req, res, next) => {
  try {
    let article = await Article.findOneAndUpdate(
      { slug: req.params.slug },
      { $inc: { favoritesCount: -1 }, $pull: { favorited: req.user.userId } },
      { new: true }
    );
    article.favorited = article.favorited.includes(req.user.userId);
    res.json({ article });
  } catch (error) {
    next(error);
  }
};

// create comments
exports.newComment = async (req, res, next) => {
  try {
    req.body.comment.author = req.user.userId;
    let comment = await Comment.create(req.body.comment);
    let article = await Article.findOneAndUpdate(
      { slug: req.params.slug },
      { $push: { comments: comment } }
    );
    var show = await Comment.findById(comment.id)
      .populate({ path: "author", select: "username , bio" })
      .exec();
    res.json({ show });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// get all comments

exports.listComments = async (req, res, next) => {
  try {
    let article = await Article.findOne({ slug: req.params.slug }).populate({
      path: "comments",
      populate: {
        path: "author",
        select: "username , bio",
        model: "User",
      },
    });

    res.json({ comments: article.comments });
  } catch (error) {
    console.log(error);
    // next(error);
  }
};

// delete comments
exports.deleteComments = async (req, res) => {
  try {
    let id = req.params.id;
    let comment = await Comment.findById(id);
    if (comment.author == req.user.userId) {
      let article = await Article.findOneAndUpdate(
        { slug: req.params.slug },
        { $pull: { comments: id } },
        { new: true }
      );
      let deletedcomment = await Comment.findByIdAndDelete(id);
      res.json({ Success: "Comment deleted successfully" });
    } else {
      res.json("User not authorised");
    }
  } catch (error) {
    next(error);
  }
};
