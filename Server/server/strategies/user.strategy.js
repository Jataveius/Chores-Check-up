var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt;

var localStrategy = require('passport-local').Strategy;

var users = require('../models/user.model');

passport.serializeUser(function(user, done) {
  console.log('serialized: ', user);
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  console.log('in passport deserializer', id);
  users.findById(id, function(err, user) {
    if(err) {
      done(err);
    }

    console.log('-----------------------------------------------\ndeserialized: ', user.id);
    done(null, user);
  });
});

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret';
console.log(opts)
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
  users.findOne({id: jwt_payload.id}, function(err, user) {
    if (err) {
      return done(err, false);
    }
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
      // or you could create a new account
    }
  });
}));

module.exports = passport;
