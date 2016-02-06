var mongoose = require('mongoose');



mongoose.connect('ds051625.mongolab.com:51625/success', {
  user: 'digibitstech',
  pass: 'applesandpeaches4life'});

var User = mongoose.model('user', mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, validate: /^(?=.*\d).{6,20}$/ }
}),'accounts');

var Task = mongoose.model('tasks', mongoose.Schema({
  username: {
    type: String,
    required: true
  }, //Required but not unique becasue it should already exits
  tasks: [{
    task: {
      type: String
    },
    description: {
      type: String
    },
    steps: {
      type: Array
    }
  }]
}),'accounts');


exports.Task = Task;
exports.User = User;