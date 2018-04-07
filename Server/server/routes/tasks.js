//requires
var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var bodyParser = require( 'body-parser' );
var task = require('../models/task.model.js');


// get tasks for specific user in database
router.get( '/:username', function( req, res ){
    console.log( 'in tasks username router get call' );
    task.find({username:req.params.username}).then(function (data){
    res.send( data);
  });
}); //end get

//get tasks from database
router.get( '/', function( req, res ){
    task.find().then(function (data){
    console.log('in tasks route get data:',data);
    res.send( data);
  });
}); //end get

//save tasks to database
router.post('/', function (req,res){
  if(req.isAuthenticated()) {
  console.log('in post to tasks:', req.body);
    var newTask;
    newTask = new task(req.body);
    console.log('new task:', newTask);
    newTask.save( function ( err, response ){
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
  // should probably be res.sendStatus(403) and handled client-side, esp if this is an AJAX request 
  res.send(false);
  }
});

//delete task using the task db id
router.delete( '/:id', function(req,res){
  console.log("in delete task request", req.params.id);
  // task.remove({_id:req.params.id}).then(function(){
  //   res.sendStatus(200);
  task.remove({_id:req.params.id}, function(err){
    if (err) {
      console.log('Error removing task from database', err);
      res.sendStatus(500);
    } else {
      console.log('DB success');
      res.sendStatus(200);
    }
  });
}); //end get

//update checkbox value in db
router.post('/update', function (req,res){
  console.log('in update post tasks:', req.body);
  var username = req.body.username;
  var description = req.body.description;
  var frequency = req.body.frequency;
  task.update({_id:req.body._id},{
    username: username,
    description: description,
    frequency: frequency,
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
//update checkbox value in db
router.post('/checkbox', function (req,res){
  console.log('in update post tasks:', req.body);
  var count = req.body.checkboxcount;
  var sun = req.body.suncheckbox;
  var mon = req.body.moncheckbox;
  var tues = req.body.tuescheckbox;
  var wed = req.body.wedcheckbox;
  var thur = req.body.thurcheckbox;
  var fri = req.body.fricheckbox;
  var sat = req.body.satcheckbox;
  task.update({_id:req.body._id},{
    checkboxcount : count,
    satcheckbox : sat,
    fricheckbox : fri,
    thurcheckbox : thur,
    wedcheckbox : wed,
    tuescheckbox : tues,
    moncheckbox : mon,
    suncheckbox : sun
    }, function(err){
    if (err) {
      console.log('Error updating task from database', err);
      res.sendStatus(500);
    } else {
      console.log('DB success');
      res.sendStatus(200);
    }
  });
});

//reset all checkboxes for specific user, use multi: true to update all
router.post('/reset', function (req,res){
  console.log('in reset checkboxes:', req.body);
  var username = req.body.username;
  var count = req.body.count;
  var sun = req.body.sun;
  var mon = req.body.mon;
  var tues = req.body.tues;
  var wed = req.body.wed;
  var thur = req.body.thur;
  var fri = req.body.fri;
  var sat = req.body.sat;
  task.update({username:req.body.username},{
    checkboxcount : count,
    satcheckbox : sat,
    fricheckbox : fri,
    thurcheckbox : thur,
    wedcheckbox : wed,
    tuescheckbox : tues,
    moncheckbox : mon,
    suncheckbox : sun
  },{ multi: true }, function(err){
    if (err) {
      console.log('Error updating task from database', err);
      res.sendStatus(500);
    } else {
      console.log('DB success');
      res.sendStatus(200);
    }
  });
});

module.exports = router;
