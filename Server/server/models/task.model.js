var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

// mongoose Schema
//tasks can be assigned to different users, checkbox value keeps track
//of tasks completed and used for calculating allowance/rewards
var taskSchema = {
  username: {type: String, required: true},
  description: {type: String, required: true},
  frequency: {type: Number, required: true},
  suncheckbox: {type: Boolean, default: false},
  moncheckbox: {type: Boolean, default: false},
  tuescheckbox: {type: Boolean, default: false},
  wedcheckbox: {type: Boolean, default: false},
  thurcheckbox: {type: Boolean, default: false},
  fricheckbox: {type: Boolean, default: false},
  satcheckbox: {type: Boolean, default: false},
  checkboxcount: {type: Number, default: 0}
};


module.exports = mongoose.model('tasks', taskSchema);
