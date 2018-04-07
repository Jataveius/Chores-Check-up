var express = require('express');
var router = express.Router();
var passport = require('passport');
var users = require('../models/user.model');
var path = require('path');

// Handles request for HTML file
router.get('/', function(req, res, next) {
    res.sendFile(path.resolve(__dirname, '../public/views/register.html'));
});

// Handles POST request with child user data
router.post('/', function(req, res) {
    console.log('in post user data', req.body);
    const df = {
        username: 'admin',
        password: 'admin',
        firstname: 'admin',
        lastname: 'admin',
        admin: true,
        calendar: 'admin',
        allowance: 1,
    }
    users.create(req.body, function(err, response) {
      if (err) {
        console.log('DB error:',err);
        res.sendStatus( 500 );
      } else {
        console.log('DB success:',response);
        res.sendStatus( 201 );
      }
    });
});

module.exports = router;
