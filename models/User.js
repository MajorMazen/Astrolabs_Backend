//table will automatically be created on mlab mongoose
//follow the file naming convention
//next is create a registration page
//create that in separate files, so the routes can get like /user/register/.... with each standing for a separate page
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  avatar: {
    type: String
  },

  date: {
    type: Date,
    default: Date.now()
  }
});

//export it as an output
module.exports = User = mongoose.model("users", UserSchema);
