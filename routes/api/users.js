const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { Mongoose } = require("mongoose");
const User = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");

/*
    @route      GET api/users
    @desc       Register User
    @access     Public
*/

router.post(
  "/",
  [
    body("name", "Name is required").not().isEmpty(),
    body("email", "Enter Valid Email").isEmail(),
    body("password", "Password is required 6 or more charachter").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let { name, email, password } = req.body;
    try {
      //if use exists
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exisits" }] });
      }
      //Get users Gravatar
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      //Encrypt password
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);

      //save user
      user = new User({
        name,
        email,
        avatar,
        password,
      });
      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.send({ token });
        }
      );
    } catch (err) {
      console.error(err);
      res.status(500).send(`server error ${err}`);
    }
  }
);

module.exports = router;
