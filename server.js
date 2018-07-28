//include the packages
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
//for after creating the user.js in routes
const users = require("./routes/users");
const passport = require("passport");

//start the server with this variable
const app = express();

//body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//allowing private routes
app.use(passport.initialize());
// Passport Config
require("./config/passport")(passport);

//look for port online otherwise on port 5000
const port = process.env.port || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));

//connection string saved inside the created config/keys.js
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

//4 api requests(get,post,delete,..)
app.get("/", (req, res) => res.json({ msg: "hello" }));
//also including other routes from users files
// '/users'  can be any string you define

//now type in chrome: http://localhost:5000/ to see hello json

//run your nodemon to auto-refresh the server
//uing global var installation: npm install nodemon -g
//now a global variable, run: nodemon server.js

//create schema for the db in models file

app.use("/users", users); //test this http://localhost:5000/users/test (bec /test is created in the /users file)
//trying out a private route, that you only see if logged in (send u have to be logged in to view)
//if u're logged on, u will see the token in the header if your get or post request
//try typing localhost:5000//dashboard and enter a token from a logged in user in 'Header' and key:Authorization
app.get(
  "/dashboard",
  passport.authenticate("jwt", { session: false }),
  (req, res) => res.json({ msg: "This is the private dashboard" })
);
