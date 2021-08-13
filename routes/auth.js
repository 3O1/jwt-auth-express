const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const { users } = require("../db-sim");
const bcrypt = require("bcrypt");

router.post(
  "/signup",
  [
    check("email", "Email is invalid, please try again.").isEmail(),
    check("password", "Your password must be at least 6 characters.").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const { password, email } = req.body;

    // Validate input
    console.log(password, email);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    // Validate if credentials exists
    let user = users.find((user) => {
      return user.email === email;
    });

    if (user) {
      res.status(400).json({
        errors: [
          {
            // value: "",
            msg: "This email is already associated with another account.",
            // param: "",
            // location: "body",
          },
        ],
      });
    }

    let hashedPassword = await bcrypt.hash(password, 10);
    users.push({
      email: email,
      password: hashedPassword,
    });
    console.log(hashedPassword);

    res.send("validation complete");
  }
);

router.get("/all", (req, res) => {
  res.json(users);
});

module.exports = router;
