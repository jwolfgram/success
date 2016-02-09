var express = require('express'),
path = require('path'),
app = express(),
bodyParser = require('body-parser'),
mongoose = require('mongoose'),
passportLocal = require('passport-local').Strategy,
passport = require('passport'),
session = require('express-session'),
flash = require('connect-flash'),
db = require('./dbs.js');

passport.use(new passportLocal({usernameField: 'username', passwordField: 'password'},
  function(username, password, done) {
    db.Account.find({ 'username': username }, function (err, docs) {
      if (docs.length === 0) {
        return done(err);
      }
      else {
        if (docs[0].password === password) {
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
  db.Account.find({ 'username': user }, function (err, docs) {
    if (docs.length === 0) {
      return done(err);
    }
    else {
      return done(err, docs[0].username);
    }
  });
});

app.post('/', bodyParser.urlencoded({ extended: false }), passport.authenticate('local',{ successRedirect: '/home', failureRedirect: '/incorrect'}));

app.post('/signup', bodyParser.urlencoded({ extended: false }), function(req, res) {
  new db.Account ({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    password: req.body.password
  }).save(function(err) {
    if (err) {
      console.log(err);
      //Incorrect username redirect
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

app.get('/api/task', function(req, res) { //This will send the users task along with the steps for ng-repete to display
  db.Account.find({ 'username': req.user }, function (err, docs) { //req.user
    if (docs.length === 0) {
      console.log(err);
    }
    else {
      console.log('Send data to frontend!');
      res.json(docs[0].tasks); //is sending, front end will need
    }
  });
});

app.post('/api/task', bodyParser.json(), function(req, res) { //This will send the users task along with the steps for ng-repete to display
  console.log(req.body); //break req.body.step into array before pushing
  var addTask = new Promise (function(resolve, reject) {
    db.Account.findOneAndUpdate(
    {'username': req.user},
    {$push: {tasks: {'task': req.body[0].task, 'steps': req.body[0].steps, 'description': req.body[0].description}}},
    function (err, docs) {
      if (err) {
        console.log(err); //Possibly if it will not make on its own, create new task
      } else {
        resolve("Success!");
      }
    });
  });
  addTask.then(
    function(value) {
      db.Account.find({ 'username': req.user }, function (err, docs) { //req.user
        if (docs.length === 0) {
          console.log(err);
        }
        else {
          console.log('Resending data!');
          console.log(docs);
          res.json(docs[0].tasks); //is sending, front end will need
        }
      });
  });
});

app.post('/api/task/delete', bodyParser.json(), function(req, res) { //This will send the users task along with the steps for ng-repete to display
  console.log(req.body[0]);
  var deleteTask = new Promise (function(resolve, reject) {
    db.Account.update({username: req.user}, {$pull: {tasks: {task: req.body[0]}}}, function (err, docs) {
      console.log('Deleted Task');
      if (err) {
        console.log(err);
        reject('Failed');
      }
      else {
        resolve("Success!");
      }
    });
  });

  deleteTask.then(
    function(value) {
      if (value === 'Success!') {
        db.Account.find({ 'username': req.user }, function (err, docs) { //req.user
          if (docs.length === 0) {
            console.log(err);
          }
          else {
            console.log('Resending data!');
            console.log(docs);
            res.json(docs[0].tasks); //is sending, front end will need
          }
        });
      }
      else {
        console(value);
      }
    });
});

app.post('/api/step', bodyParser.json(), function(req, res) {
  //Define child schema to work with... mayby add task then or try the hard way whichever
  db.Account.update({username: req.user}, {$push: {tasks: {task: req.body[0], steps: req.body[1]}}}, function (err, docs) {
    console.log(err);
  });
//NULLLLLLL
  db.Account.update({username: req.user}, {$pull: {tasks: {task: req.body[0]}}}, function (err, docs) {
      console.log('Deleted Task');
      if (err) {
        console.log(err);
        reject('Failed');
      }
      else {
        resolve("Success!");
      }
    });
//Resending new task data with update to frontend
  db.Account.find({ 'username': req.user }, function (err, docs) { //req.user
    if (docs.length === 0) {
      console.log(err);
    }
    else {
      console.log('Resending data!');
      console.log(docs);
      res.json(docs[0].tasks); //is sending, front end will need
    }
  });
});

app.use('/angular/template/', express.static('public/angularTemplates'));
app.use('/angular', express.static('node_modules/angular-route/'));
app.use('/style',express.static('public/css')); //Route to /style for css
app.use('/js',express.static('public/js')); //Route to /js for javascript
app.use('/images',express.static('public/images')); //Route to /images for images

app.listen(process.env.PORT || 8081);