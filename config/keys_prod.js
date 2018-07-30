// install and sign up on heroku
// using heroku, go to settings and add your mlab db configuration variables on production (MONGO_URI & SECRET)
module.exports = {
  mongoURI: process.env.MONGO_URI,
  secret: process.env.SECRET
};
