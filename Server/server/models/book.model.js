var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

// mongoose Schema
var bookSchema = {
  username: {type: String, required: true},
  title: {type: String, required: true},
  author: {type: String, required: true},
  pages: {type: Number, required: true},
  level: {type: String, required: false},
  date: {type: Date, required: true},
  summary: {type: String},
  momapproved: {type: String, default:"Waiting Approval"}
};


module.exports = mongoose.model('books', bookSchema);
