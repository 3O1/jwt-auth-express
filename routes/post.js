const router = require("express").Router();
const { publicPosts, privatePosts } = require("../db-sim");
// const checkAuth = require("../middleware/checkAuth");
const JWT = require("jsonwebtoken");

router.get("/public", (req, res) => {
  res.json(publicPosts);
});

router.get(
  "/private",
  async (req, res, next) => {
    const token = req.header("x-auth-token");

    if (!token) {
      return res.status(400).json({
        errors: [
          {
            msg: "No token found",
          },
        ],
      });
    }

    try {
      let user = await JWT.verify(token, "dkfhawie43h42khseridwefuk2oisdqw5");
      req.user = user.email;
      // check if user uid is = owner of post etc after validation
      next();
    } catch (error) {
      return res.status(400).json({
        errors: [
          {
            msg: "Token invalid",
          },
        ],
      });
    }
  },
  (req, res) => {
    console.log(req.user);
    res.json(privatePosts);
  }
);

module.exports = router;
