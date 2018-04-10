//requires
var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var bodyParser = require( 'body-parser' );
var book = require('../models/book.model.js');
//get books from database
router.get( '/', function( req, res ){
    book.find().then(function (data){
    console.log('in books route get data:',data);
    res.send( data);
  });
}); //end get
// get tasks for specific user in database
router.get( '/userbooks', function( req, res ){
    console.log( 'in books username router get call', req.user.username );
    book.find({username:req.user.username}).then(function (data){
    res.send( data);
  });
}); //end get
//save tasks to database
router.post('/', function (req,res){
  if(req.isAuthenticated()) {
  console.log('in post to books:', req.body, req.user.username);
    var newBook;
    bookObj = {
      title: req.body.title,
      author: req.body.author,
      pages: req.body.pages,
      level: req.body.level,
      summary: req.body.summary,
      date: req.body.date,
      username: req.user.username,
      momapproved: "Waiting Approval"
    };
    newBook= new book (bookObj);
    // new book(req.body,req.user.username);
    console.log('new book:', newBook);
    newBook.save( function ( err, response ){
      if (err) {
        console.log('DB error:',err);
        res.sendStatus( 500 );
      } else {
        console.log('DB success:',response);
        res.sendStatus( 201 );
      }
    });
  } else {
  // failure best handled on the server. do redirect here.
  console.log('not logged in :(');
  // should probably be res.sendStatus(403) and handled client-side, esp if this is an AJAX request (which is likely with AngularJS)
  res.send(false);
  }
});
//delete task using the task db id
router.delete( '/:id', function(req,res){
  console.log("in delete book request", req.params.id);
  // task.remove({_id:req.params.id}).then(function(){
  //   res.sendStatus(200);
  book.remove({_id:req.params.id}, function(err){
    if (err) {
      console.log('Error removing task from database', err);
      res.sendStatus(500);
    } else {
      console.log('DB success');
      res.sendStatus(200);
    }
  });
}); //end get
//update momapproved value in db
router.post('/update', function (req,res){
  console.log('in update book reward bonus:', req.body);
  var reward = req.body.reward;
  book.update({_id:req.body.book_id},{
    momapproved: reward,
  },function(err){
    if (err) {
      console.log('Error updating taks from database', err);
      res.sendStatus(500);
    } else {
      console.log('DB success');
      res.sendStatus(200);
    }
  });
});

module.exports = router;
