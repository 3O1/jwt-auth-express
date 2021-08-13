const JWT = require("jsonwebtoken");

module.exports = async (req, res, next) => {
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

  JWT.verify(token, "dkfhawie43h42khseridwefuk2oisdqw5");
};
