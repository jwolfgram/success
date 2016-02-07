var mongoose = require('mongoose');

mongoose.connect('ds051625.mongolab.com:51625/success', {
  user: 'digibitstech',
  pass: 'applesandpeaches4life'});

var AccountSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: { type: String, required: true, validate: /^(?=.*\d).{6,20}$/ },
  tasks: [{
    task: {
      type: String
    },
    description: {
      type: String
    },
    steps: {
      type: Array
    },
    _id: false
  }]
});

var Account = mongoose.model('account', AccountSchema);

var TaskSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: { type: String, required: true, validate: /^(?=.*\d).{6,20}$/ },
  tasks: [{
    task: {
      type: String
    },
    description: {
      type: String
    },
    steps: {
      type: [{step: {type: String, required: true}}, {checked: {type: Boolean, default: false}}]
    },
    _id: false
  }]
});

//var Task = mongoose.model('account', TaskSchema);


exports.Account = Account;