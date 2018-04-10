var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors')
var jwt = require('jsonwebtoken');

var passport = require("passport");
var passportJWT = require("passport-jwt");

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
jwtOptions.secretOrKey = 'chores';

var users = require('./models/user.model');
var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
    users.findOne({_id: jwt_payload.id}, function(err, user) {
        if (err) {
            return next(err, false);
        }
        if (user) {
            return next(null, user);
        } else {
            return next(null, false);
        }
    });
});
passport.use(strategy);

var app = express();
// Route includes
var index = require('./routes/index');
var user = require('./routes/user');
var admin = require('./routes/admin');
var register = require('./routes/register');
var username = require('./routes/usernames');
var tasks = require('./routes/tasks');
var checklist = require('./routes/checklist');
var bank = require('./routes/bank');
var adminbank = require('./routes/adminbank');
var funstuff = require('./routes/funstuff');
var books = require('./routes/books');
var bonusrewards = require('./routes/bonusrewards');

// Body parser middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// start up passport sessions


// Routes
app.use('/bonusrewards', bonusrewards);
app.use('/books', books);
app.use('/funstuff', funstuff);
app.use('/adminbank', adminbank);
app.use('/bank', bank);
app.use('/checklist', checklist);
app.use('/tasks',passport.authenticate('jwt', { session: false }), tasks );
app.use('/usernames', username);
app.use('/register', register);
app.use('/admin', admin);
app.use('/user', user);

// Mongo Connection //
var mongoURI = '';
// process.env.MONGODB_URI will only be defined if you
// are running on Heroku
if(process.env.MONGODB_URI != undefined) {
    // use the string value of the environment variable
    mongoURI = process.env.MONGODB_URI;
} else {
    // use the local database server
    mongoURI = 'mongodb://localhost:27017/chorescheckupapp';
}

// var mongoURI = "mongodb://localhost:27017/passport";
var mongoDB = mongoose.connect(mongoURI).connection;


mongoDB.on('error', function(err){
   if(err) {
     console.log("MONGO ERROR: ", err);
   }
   res.sendStatus(500);
});

mongoDB.once('open', function(){
   console.log("Connected to Mongo!");
});

// App Set //
app.set('port', (process.env.PORT || 3030));

// Listen //
app.listen(app.get("port"), function(){
   console.log("Listening on port: " + app.get("port"));
});
