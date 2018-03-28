const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 3003;
const models = require("./models");
var path = require('path');
var bodyParser = require('body-parser');

const passport = require("passport");
const session = require('express-session');

// Body parser 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Configure body parser for AJAX requests
app.use(express.urlencoded({extended:true}));
app.use(express.json());
// Serve up static assets
app.use(express.static(path.join(__dirname, './public')));


 // For Passport
app.use(session({ secret: 'secret', key: 'user', resave: true, 
saveUninitialized:false, cookie: {maxage: 60000, secure: false}})); // session secret

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
require('./config/passport.js')(passport,models.User);

// Add routes, both API and view
const routes = require("./routes")(passport);
app.use('/',routes);


// Set up promises with mongoose
mongoose.Promise = global.Promise;
// Connect to the Mongo DB
//add mongo heroku uri
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/chores-check-up-development"
);

// Start the API server
app.listen(PORT, function() {
  console.log("🌎  ==> API Server now listening");
});