var express = require('express'),
path = require('path'),
app = express(),
bodyParser = require('body-parser'),
mongoose = require('mongoose'),
passportLocal = require('passport-local').Strategy,
passport = require('passport'),
session = require('express-session'),
flash = require('connect-flash');

mongoose.connect('ds051625.mongolab.com:51625/success', {
  user: 'digibitstech',
  pass: 'applesandpeaches4life'});

passport.use(new passportLocal({usernameField: 'username', passwordField: 'password'},
  function(username, password, done) {
    User.find({ 'username': username }, function (err, docs) {
      if (docs.length === 0) {
        return done(err);
      }
      else {
        if (docs[0].password === password) { //No loop needed, we just find the one user and check the password when Mongoose returns.
          console.log('Verified password matches user');
          return done(null, username);
        }
        else {
          console.log('Could not verify password was correct');
          return done(null, false, { message: 'Incorrect Login.' });
        }
      }
    });
  }));

app.use(flash());
app.use(session({ secret: '2066618487', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  console.log('Authenticated: ' + user);
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  User.find({ 'username': user }, function (err, docs) {
    if (docs.length === 0) {
      return done(err);
    }
    else {
      //console.log(docs[0].username + ' has been deserialized');
      return done(err, docs[0].username);
    }
  });
});

app.post('/', bodyParser.urlencoded({ extended: false }), passport.authenticate('local',{ successRedirect: '/home', failureRedirect: '/incorrect'}));

var User = mongoose.model('user', mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, validate: /^(?=.*\d).{6,20}$/ }
}), 'accounts');


app.post('/signup', bodyParser.urlencoded({ extended: false }), function(req, res) {
  new User ({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    password: req.body.password
  }).save(function(err) {
    if (err) {
      console.log(err);
    }else {
      console.log('User saved successfully!');
      res.redirect('/');
    }
  });
});

/*Above is passport redirection procedure */

app.get('/', function(req, res) {
  if (req.isAuthenticated()) {
    res.redirect('/home');
  } else {
    res.sendFile(path.join(__dirname + '/public/html/login.html'));
  }
});

app.get('/incorrect', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/html/incorrectLogin.html'));
});

app.get('/home', function(req, res) {
  if (req.isAuthenticated()) {
    res.sendFile(path.join(__dirname + '/public/html/board.html'));
  } else {
    res.redirect('/');
  }
});

app.get('/logout', function(req, res) {
  if (req.isAuthenticated()) {
    req.logout();
    res.redirect('/');
  } else {
    console.log('User should have not gotten here....');
    res.redirect('/');
  }
});

app.get('/incorrect', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/html/incorrectLogin.html'));
});

var Task = mongoose.model('task', mongoose.Schema({
  username: { type: String, required: true },
  task: { type: String, required: true },
}), 'accounts');

var Step = mongoose.model('step', mongoose.Schema({
  username: { type: String, required: true },
  $push: {"step": {type: String, checked: 'title', msg: 'msg'}},
  task: { type: String, required: true },
}), 'accounts');

/*
Contact.findByIdAndUpdate(
    info._id,
    {$push: {"messages": {title: 'title', msg: 'msg'}}},
    {safe: true, upsert: true},
    function(err, model) {
        console.log(err);
    }
);*/

app.get('/api/task', function(req, res) {

  });





  /*new Task ({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    password: req.body.password
  }).save(function(err) {
    if (err) {
      console.log(err);
    }else {
      console.log('User saved successfully!');
      res.redirect('/');
    }
    });*/
app.use('/angular/template/', express.static('public/angularTemplates'));
app.use('/angular', express.static('node_modules/angular-route/'));
app.use('/style',express.static('public/css')); //Route to /style for css
app.use('/js',express.static('public/js')); //Route to /js for javascript
app.use('/images',express.static('public/images')); //Route to /images for images

app.listen(process.env.PORT || 8080);