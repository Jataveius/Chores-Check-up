const express = require("express");
const mongoose = require("mongoose");
const models = require("./server/models");
const config = require('./config');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3001;

const passport = require("passport");
const session = require('express-session');

// // Configure body parser for AJAX requests
// app.use(express.urlencoded({extended:true}));
// app.use(express.json());

// Serve up static assets
// app.use(express.static("client/build"));
//Static files in directory
app.use(express.static('./server/static/'));
app.use(express.static('./client/dist/'));
// tell the app to parse HTTP body messages
app.use(bodyParser.urlencoded({ extended: false }));

 // For Passport
// app.use(session({ secret: 'changeThis',resave: true, saveUninitialized:true})); // session secret
app.use(passport.initialize());
// app.use(passport.session()); // persistent login sessions
// require('./server/models')(passport,models.User);

// connect to the database and load models
require('./server/models').connect(config.dbUri);

// load passport 
const localSignupStrategy = require('./server/passport/local-signup');
const localLoginStrategy = require('./server/passport/local-login');
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);

// pass the authenticaion checker middleware
const authCheckMiddleware = require('./server/middleware/auth-check');
app.use('/api', authCheckMiddleware);

// Add routes, both API and view
// const routes = require("./routes")(passport);
// app.use('/',routes);

// routes
const authRoutes = require('./server/routes/auth');
const apiRoutes = require('./server/routes/api');
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

// Set up promises with mongoose
mongoose.Promise = global.Promise;
// Connect to the Mongo DB
//add mongo heroku uri
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/chore-check-up-development"
);

// Start the API server
app.listen(PORT, function() {
  console.log("🌎  ==> API Server now listening");
});