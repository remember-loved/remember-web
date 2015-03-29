var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {title: 'Remember loved ones'});
});

/* GET signup page. */
router.get('/signup', function (req, res, next) {
  res.render('signup', {title: 'Sign Up'});
});

/* GET login page */
router.get('/login', function (req, res, next) {
  res.render('login', {title: 'Login'});
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/login');
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      var redirectPath = '/users/' + user.userName;
      return res.redirect(redirectPath);
    });
  })(req, res, next);
});

router.post('/logout', function (req, res, next){
  req.logout();
  res.redirect('/');
});

module.exports = router;
