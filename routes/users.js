//this to create new routes
// (1) include packages
const express = require("express");
//use a router which is a function in express
const router = express.Router();
//include for password encryption
const bcrypt = require("bcryptjs");
// include the User model to use and instantiate users
const User = require("../models/User");
const bodyParser = require("body-parser");
// include for fetching personal profile pics
const gravatar = require("gravatar");
//include those for hashing tokens in arguemnt: secret
const keys = require("../config/keys");
// include to protect your private route from being accessed through sending and validating tokens
const passport = require("passport");
// more convenient than cookies for separate front and back-end layers
// sends you a webtoken (key), which is valid for some time after signing in correctly
const jwt = require("jsonwebtoken");

// (2) defining a new route (/test request)
// test on http://localhost:5000/<theStringYouDefineInServer.js>/test
router.get("/test", (req, res) => res.json({ msg: "users work" }));

// (3) now create a registration route, would be a post request with name, email & password
//check if user already exists (read through the models/User folder if already registered)
//the req.body can be tested through postman caus there's no frontend
//post is an express fn, with a callback fn(req, res) as input
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

      //password encryption
      bcrypt.genSalt(10, (err, salt) => {
        //function body, arguemnts are (err & salt) which are also retrieved after genSalt's finished
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save() //attempt saving anyway
            .then(user => res.json(user)) //after that if successful...
            .catch(err => console.log(err)); //if not....
        });
      });
    }
  });
});

// (4) now test this on postman (download it)
//put http://localhost:5000/<theStringYouDefineInServer.js>/test
//choose post and put the data in the body x-www-form section and hit send

// (5) create a login request (with email and password)
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //optional: validate input keys (key-value pairs) or identifiers to avoid crashing the server
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
          //passport package protects your private route from being accessed, the token is personalised and expires, decoupled from application
          //tokens also can have data stored in them too (like retaining user name without constantly consulting the db)
          //can use cookies to store user data, cookies are browser based, we are decoupled, use webtokens instead

          // will use later
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
