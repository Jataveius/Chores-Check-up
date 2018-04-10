var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var user = require('../models/user.model.js');

// Handles Ajax request for user information if user is authenticated
router.get('/', function(req, res) {
  console.log('get /user route');
  // check if logged in
  if(req.isAuthenticated()) {
    // send back user object from database
    console.log('logged in');
    res.json(req.user);
  } else {
    // failure best handled on the server. do redirect here.
    console.log('not logged in');
    // should probably be res.sendStatus(403) and handled client-side, esp if this is an AJAX request (which is likely with AngularJS)
    res.send(false);
  }
});
router.post('/login', function(req, res) {
  const {username, password} = req.body;

  user.findOne({username: username}, function(err, user) {
    if(err) {
      res.json({status: 'error', message: err.message})
    }

    // user variable passed to us from Mongoose if it found a match to findOne() above
    if(!user) {
      // user not found
      console.log('userStrategy.js :: no user found');
      res.json({status: 'error', message: 'no user Found!'})
    } else {
      // found user! Now check their given password against the one stored in the DB
      // comparePassword() is defined in the schema/model file!
      user.comparePassword(password, function(err, isMatch) {
        if(err) {
          res.json({status: 'error', message: err.message})
        }

        if(isMatch) {
          const userItem = {
            username: user.username,
            id: user._id,
          }
          const token = jwt.sign(userItem, 'chores'); // 15 minutes
          console.log(token)
          user.token = token;
          // all good, populate user object on the session through serializeUser

          res.json({status: 'success', data: {...user.toJSON(), token}})
        } else {
          res.json({status: 'error', message: 'Incorrect credentials.'})
        }
      });
    } // end else
  }); // end findOne
});

// clear all server session information about this user
router.get('/logout', function(req, res) {
  // Use passport's built-in method to log out the user
  console.log('Logged out');
  req.logOut();
  res.sendStatus(200);
});

//delete user from db
router.delete( '/:id', function(req,res){
    console.log("in delete user request", req.params.id);
    user.remove({_id:req.params.id}, function(err){
      if (err) {
        console.log('Error removing user from database', err);
        res.sendStatus(500);
      } else {
        console.log('DB success');
        res.sendStatus(200);
      }
  });
}); //end get


module.exports = router;
