// (1) npm install express mongoose body-parser bcryptjs jsonwebtokenpassport passport-jwt gravatar
// (2) include the packages
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
// (11) for after creating the user.js in routes
const users = require("./routes/users");
// (13) Allowing private routes (users should be logged in with a valid token to view)
const passport = require("passport");

// (3) start the server with this variable
const app = express();

// (5) Enable json send and receive/read in server
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// (13) Allowing private routes (users should be logged in with valid tokens to view)
// create a file ./config/passport.js, paste contents and link it
app.use(passport.initialize());
// Passport Config
require("./config/passport")(passport);

// (4) look for port online otherwise on port 5000
const port = process.env.port || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));

// (8) connect to already existing mlab db we called astrolabs.
// create config/keys_dev.js and save the connection string in it.
const db = require("./config/keys").mongoURI;

// (9) Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// (10) create a schema (new table) for the db in ./models/User.js
// which mongoose will automatically recognize and process

// (5) create api. there are 4 api requests(get,post,delete,..)
//now type in chrome: http://localhost:5000/ to see hello json
app.get("/", (req, res) => res.json({ msg: "hello" }));

// (6) install your nodemon to auto-refresh the server: npm install nodemon -g
// (7) now a global variable, run: 'nodemon server.js' to see changes by just refreshing chrome

// (11) create routes inside ./routes/users.js
// '/users'  can be any string you define, which will be tailed by the links created inside the file users.js
// test this on http://localhost:5000/users/test
app.use("/users", users);

// (12) go to Postman and test additional routes defined in users.js

// (13) Allowing private routes (users should be logged in with a valid token to view)
//if u're logged on, u will see a valid token in the header in your get or post request
// in Postman, enter the link http://localhost:5000/dashboard and enter the token value from a logged in user in
// Header -> Key: Authorization
app.get(
  "/dashboard",
  passport.authenticate("jwt", { session: false }),
  (req, res) => res.json({ msg: "This is the private dashboard" })
); //else will send unauthorized

// (14) also remove some files from being uploaded to git in .gitignore
// (15) press git init, add, commit, push
// cd filename
// git init
// git add .
// git status
// git commit -m "the complete project"
// git remote add origin https://github.com/MajorMazen/Astrolabs_Backend.git
// git push -u origin master

// (16) create on heroku a project named Astrolabs_Backend
// push to heroku through: heroku git:remote -a Astrolabs_Backend
// and try on postman with its new link heroku/projectname
