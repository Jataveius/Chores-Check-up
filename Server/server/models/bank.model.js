var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

// mongoose Schema
var bankSchema = {
  username: {type: String, required: true},
  transaction: {type: String, required: true},
  amount: {type: Number, required: true},
  date: {type: Date, required: true},
  comment: {type: String}
};


module.exports = mongoose.model('banks', bankSchema);
