var express = require("express");
var router = express.Router();
var Article = require("../model/article");
var User = require("../model/user");
var Comment = require("../model/comment");
var auth = require("../middlewares/auth");
var slug = require("slug");
var article = require("../controllers/articles");



// list  of all articles (GET /api/articles )
router.get("/", article.list);

//feed article ( GET /api/articles/feed )
router.get("/feed",auth.verifyToken, article.feed);

// create article  ( POST /api/articles )

router.post("/", auth.verifyToken,article.create);

//get single article  ( GET /api/articles/:slug )

router.get("/:slug", article.get);

// update article (PUT /api/articles/:slug )
router.put("/:slug",auth.verifyToken, article.update);

// delete article ( DELETE /api/articles/:slug )
router.delete("/:slug",auth.verifyToken, article.delete);

// favorite article ( POST /api/articles/:slug/favorite )
router.post("/:slug/favorite",auth.verifyToken, article.favorite);

//unfavorite article ( DELETE /api/articles/:slug/favorite )
router.delete("/:slug/favorite",auth.verifyToken, article.unfavorite);

// create comment (POST /api/articles/:slug/comments )

router.post("/:slug/comments", auth.verifyToken,article.newComment);

// get all comments for single articles ( GET /api/articles/:slug/comments )
router.get("/:slug/comments",auth.verifyToken, article.listComments);

// delete single comments ( DELETE /api/articles/:slug/comments/:id )
router.delete("/:slug/comments/:id",auth.verifyToken, article.deleteComments);

module.exports = router;
