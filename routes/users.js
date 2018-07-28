//this is a new route
const express = require("express");
//use a router which is a function in express
const router = express.Router();
//include for password decryption
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const bodyParser = require("body-parser");
const gravatar = require("gravatar");
//include those for tokens
const keys = require("../config/keys");
const passport = require("passport");
const jwt = require("jsonwebtoken");

//defining a new route (/test request)
router.get("/test", (req, res) => res.json({ msg: "users work" }));

//now create a registration route, would be a post request
//check if user already exists (read through the models/User folder if already registered)
//the req.body can be tested through postman caus there's no frontend
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then(outcomeuser => {
    if (outcomeuser) {
      return res.status(400).json({ email: "email already exists" });
    } else {
      //look for the user email on gravatar and fetch it
      const avatar = gravatar.url(req.body.email, {
        s: "200", // Size
        r: "pg", // Rating
        d: "mm" // Default
      });

      //user is created but not saved to the db
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        avatar: avatar
      });

      //encryption
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
    //now test this on postman (download it)
    //put the url "localhost:5000/users/register" and choose post
    //put the data in the body x-www-form section and hit send
  });
});

//create a login request
router.post("/login", (req, res) => {
  //defining them as variables to make life easier
  const email = req.body.email;
  const password = req.body.password;

  //validate the keys
  if (!email || !password) {
    return res.status(400).json({ message: "Invalid email and password" });
  }

  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(400).json({ email: "user account doesn't exist" });
    } else {
      //use bcrypt to compare the entered password to the hashed db version
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          //log them in
          //passport package protects your private route from being accessed, it's personalised and expires, decoupled from application
          //tokens also can have data stored in them too (like retaining user name without constantly consulting the db)
          //can use cookies to store user data, cookies are browser based, we are decoupled, use webtokens instead

          const payload = { id: user.id, name: user.name };
          //tokens are also secured, are hashed through salt which i secretly define in keys.js
          // Sign Token
          jwt.sign(payload, keys.secret, { expiresIn: 3600 }, (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          });
        } else {
          return res.status(400).json({ email: "password is invalid" });
        }
      });
    }
  });
});

//make it an output
module.exports = router;

//var func  = function () {

//}

///var func = () => {

//}
