const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const { users } = require("../db-sim");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

/** SIGNUP */
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
      return res.status(400).json({
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

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({
      email: email,
      password: hashedPassword,
    });
    console.log(hashedPassword);

    // JWT
    const token = await JWT.sign(
      {
        // PAYLOAD
        email,
      },
      // might want to have in a .env file
      "dkfhawie43h42khseridwefuk2oisdqw5",
      {
        // object
        expiresIn: 3600000,
      }
    );

    // send token to client
    res.json({
      token,
    });
  }
);

/** LOGIN */

// can add express-validator to validate email - prevent unecessary db calls
router.post("/login", async (req, res) => {
  const { password, email } = req.body;

  // check if user with that email exists
  let user = users.find((user) => {
    return user.email === email;
  });

  // if user is undefined -> trigger error
  if (!user) {
    return res.status(400).json({
      errors: [
        {
          // don't want to be specific
          // msg: "There is no account associated with that email.",
          msg: "The email or password you entered is invalid.",
        },
      ],
    });
  }

  // compare hashed password in the db
  let isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return res.status(400).json({
      errors: [
        {
          // don't want to be specific
          // msg: "There is no account associated with that email.",
          msg: "The email or password you entered is invalid.",
        },
      ],
    });
  }

  // JWT
  const token = await JWT.sign(
    {
      // PAYLOAD
      email,
    },
    // might want to have in a .env file
    "dkfhawie43h42khseridwefuk2oisdqw5",
    {
      // object
      expiresIn: 3600000,
    }
  );

  // send token to client
  res.json({
    token,
  });
});

router.get("/all", (req, res) => {
  res.json(users);
});

module.exports = router;
