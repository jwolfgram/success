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

var Task = mongoose.model('step', mongoose.Schema({
  username: { type: String, required: true }, //Required but not unique becasue it should already exits
  tasks: { type: String, required: true }
}), 'accounts');

app.get('/api/task', function(req, res) { //This will send the users task along with the steps for ng-repete to display
  Task.find({ 'username': 'jwolfgram' }, function (err, docs) { //req.user
    if (docs.length === 0) {
      console.log(err);
    }
    else {
      console.log('got else!');
      res.json(docs[0].tasks); //is sending, front end will need
    }
  });
});

app.post('/api/task', bodyParser.urlencoded({ extended: false }), function(req, res) { //This will send the users task along with the steps for ng-repete to display
  console.log(req.user);
  console.log(req.body);
  console.log(req.body.step.length);

  Task.findOneAndUpdate(
    {'username': req.user},
    {$push: {tasks: {'task': req.body.taskname, 'step': req.body.step, 'description': req.body.taskdescription}}},
    function (err, docs) {
      if (docs.length === 0) {
      return done(err); //Possibly if it will not make on its own, create new task
    } else {
      console.log(docs);
    }
  });

  res.redirect('/home');
});

app.post('/api/step', function(req, res) {
//This will send the users task along with the steps for ng-repete to display
});

app.use('/angular/template/', express.static('public/angularTemplates'));
app.use('/angular', express.static('node_modules/angular-route/'));
app.use('/style',express.static('public/css')); //Route to /style for css
app.use('/js',express.static('public/js')); //Route to /js for javascript
app.use('/images',express.static('public/images')); //Route to /images for images

app.listen(process.env.PORT || 8080);