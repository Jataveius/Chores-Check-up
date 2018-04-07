//requires
var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var bodyParser = require('body-parser');
var bank = require('../models/bank.model.js');
// create bank deposit/withdrawal record in db
router.post('/', function (req,res){
  console.log('in post to bank:', req.body);
  // send back user object from database
  var newTransaction;
  newTransaction = new bank(req.body);
  newTransaction.save( function ( err, response ){
    if (err) {
      console.log('DB error:',err);
      res.json({status: 'error', message: err.message });
    } else {
      console.log('DB success:',response);
      res.json({status: 'success', data: response });
    }
  });
});
  //get username specific data from bank collection in db
  router.get('/:username', function (req,res){
    console.log ('in router get user bank transactions');
    bank.find({username:req.params.username}).then(function (data){
    console.log('in bank username route get data:',data);
    res.send( data);
    });//end get username
  });
  //get all data from bank collection in db
  router.get('/', function (req, res){
    console.log ('in router get bankTransactions');
    bank.find().then(function (data){
      console.log('in bank route get data:',data);
      res.json( {data});
    });
  });//end get
  //delete task using the task db id
  router.delete( '/:id', function(req,res){
    console.log("in delete transaction request", req.params.id);
    bank.remove({_id:req.params.id}, function(err){
      if (err) {
        console.log('Error removing transaction from database', err);
        res.sendStatus(500);
      } else {
        console.log('DB success');
        res.sendStatus(200);
      }
    });
  });//end delete

  //update transaction value in db
  router.post('/update', function (req,res){
    console.log('in update bank post:', req.body);
    // var date = req.body.date;
    var transaction = req.body.transaction;
    var amount = req.body.amount;
    var username = req.body.username;
    var comment = req.body.comment;
    bank.update({_id:req.body._id},{
      // date: date,
      transaction: transaction,
      amount: amount,
      username: username,
      comment: comment
      }, function(err){
      if (err) {
        console.log('Error updating transaction from database', err);
        res.sendStatus(500);
      } else {
        console.log('DB success');
        res.sendStatus(200);
      }
    });
  });
module.exports = router;
