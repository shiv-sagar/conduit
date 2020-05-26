var express = require("express");
var router = express.Router();
var User = require("../model/user");
var auth = require("../middlewares/auth");
var Article = require("../model/article");
var api= require('../controllers/api')

//users route handle

//register user  ->POST /api/users

router.post("/users", api.register);

//user login ->POST /api/users/login

router.post("/users/login",api.login );

//get current user ->GET /api/user  authentication required
router.get("/user",auth.verifyToken, api.currentUser );

// update current user -> PUT /api/user
router.put("/user",auth.verifyToken, api.updateUser);

//get profile by username -> GET /api/profiles/:username

router.get("/profiles/:username", api.profile);

//following profile by username ->POST /api/profiles/:username/follow
router.post(
  "/profiles/:username/follow",auth.verifyToken,
  api.follow
);

// unfollow user -> DELETE /api/profiles/:username/follow

router.delete(
  "/profiles/:username/follow",auth.verifyToken,
 api.unfollow
);

// list of tags -> GET /api/tags
router.get('/tags',api.tags)

module.exports = router;
