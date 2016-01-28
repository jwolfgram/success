var express = require('express'),
path = require('path'),
app = express(),
bodyParser = require('body-parser'),
mongoose = require('mongoose'),
passportLocal = require('passport-local').Strategy,
passport = require('passport'),
session = require('express-session');

mongoose.connect('mongodb://localhost/success');

passport.use(new passportLocal({usernameField: 'username', passwordField: 'password'},
  function(username, password, done) {
    console.log('How did we get here...' + username);
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

app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true }));
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

app.post('/login', bodyParser.urlencoded({ extended: false }), passport.authenticate('local',{ successRedirect: '/home', failureRedirect: '/'}));

var User = mongoose.model('login', mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}));

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

app.get('/', function(req, res) {
  if (req.isAuthenticated()) {
    res.redirect('/home');
  } else {
    res.sendFile(path.join(__dirname + '/public/html/login.html'));
  }
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

app.use('/angular', express.static('node_modules/angular-route/'));
app.use('/style',express.static('public/css')); //Route to /style for css
app.use('/js',express.static('public/js')); //Route to /js for javascript
app.use('/images',express.static('public/images')); //Route to /images for images
app.use('/angular', express.static('node_modules/angular-route/'));

app.listen(process.env.PORT || 8080);