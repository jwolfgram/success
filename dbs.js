var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/success', function(err) {
  if(err) {console.log(err);}
});

var StepsSchema = new mongoose.Schema({
  step: String,
  checked: {type: Boolean, default: false}
});

var TaskSchema = new mongoose.Schema({
    task: {
      type: String
    },
    steps: [StepsSchema],
    due: Date,
    remind: Date
});

var AccountSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: { type: String, required: true, validate: /^(?=.*\d).{6,20}$/ },
  tasks: [TaskSchema]
});

var Account = mongoose.model('account', AccountSchema);

//var Task = mongoose.model('account', TaskSchema);


exports.Account = Account;
exports.StepsSchema = StepsSchema;
exports.TaskSchema = TaskSchema;
exports.AccountSchema = AccountSchema;

