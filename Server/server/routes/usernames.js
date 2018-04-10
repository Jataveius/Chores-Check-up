//requires
var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var bodyParser = require( 'body-parser' );
var users = require('../models/user.model.js');



router.get( '/', function( req, res ){
  users.find().then(function (data){
    res.send( data);
  });
}); //end get

module.exports = router;
