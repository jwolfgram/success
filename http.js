var express = require('express'),
path = require('path'),
app = express(),
bodyParser = require('body-parser'),
mongoose = require('mongoose'),
passportLocal = require('passport-local').Strategy,
passport = require('passport');

mongoose.connect('mongodb://localhost/success');


passport.use(new passportLocal({
    usernameField: 'username',
    passwordField: 'password'
  },
  function(username, password, done) {
    if (username === 'username' && password === 'password') {
      console.log('Login accepted: ' + username);
      return done(null, true, username);  //failed to serialize user error here....
    }
    else {
      console.log('Login Rejected');
      return done(null, false, { message: 'Incorrect Login.' });
    }
    console.log('Login gone messed up');
  }
));

var theInitializer = passport.initialize();
app.use(theInitializer);

passport.serializeUser(function(user, done) {
  console.log('serializeUser:: ' + user);
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  console.log('deserializeUser:: ' + user);
  done(null, false, user);
});

app.post('/login', bodyParser.urlencoded({ extended: false }), passport.authenticate('local',{ successRedirect: '/home', failureRedirect: '/'}), function(req, res) {
  console.log('Hello');
});

/*Above is passport redirection procedure */

var User = mongoose.model('login', mongoose.Schema({
  user: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}));

var Task = mongoose.model('task', mongoose.Schema({
    user: String,
    task: [{
      title: String,
      step: String,
      note: [{
        comment: String,
        date: { type: Date, default: Date.now },
      }]
    }]
    }));

/* This is the block we will use to make a new user to login with */

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/html/login.html'));
  console.log('Wooa!Another User!');
});

app.get('/home', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/html/board.html'));
});

new User ({
  user: 'joe',
  password: 'password'
}).save(function(err) {
  if (err) {
    console.log(err);
  }else {
    console.log('User saved successfully!');
  }
});

app.get('/db', function (req, res) {
  //new score({ name: 'Joe', score: '10'  }).save();
  score.find({}, function (err, docs) {
    res.send(docs);
  });
});

app.use('/style',express.static('public/css')); //Route to /style for css
app.use('/js',express.static('public/js')); //Route to /js for javascript
app.use('/images',express.static('public/images')); //Route to /images for images
app.use('/angular', express.static('node_modules/angular-route/'));

app.listen(8080);