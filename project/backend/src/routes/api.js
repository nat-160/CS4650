// Example routes/api.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/controller");

// GET routes
router.get("/", controller.default);
router.get("/user/:username", controller.user);
router.get("/users", controller.users);

// POST routes
// register(username, password)
router.post("/register", controller.register);
// login(username, password)
router.post("/login", controller.login);
// home(token)
router.post("/home", controller.home);
// new(token, message)
router.post("/new", controller.new);
// delete(token, messageID)
router.post("/delete", controller.delete);
// follow(token, followingName)
router.post("/follow", controller.follow);
// unfollow(token, followingName)
router.post("/unfollow", controller.unfollow);
// unregister(token, password)
router.post("/unregister", controller.unregister);
// followstate(token,followingName)
router.post("/followstate", controller.followstate);
// followtoggle(token,followingName)
router.post("/followtoggle", controller.followtoggle);
// me(token)
router.post("/me", controller.me);

module.exports = router;
