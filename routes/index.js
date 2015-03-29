'use strict';
var express = require('express');
var router = express.Router();
var dbManager = require('../models/DBManager');
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

/* POST to log user out */
router.post('/logout', function (req, res, next){
  req.logout();
  res.redirect('/');
});

/* GET information about a device*/
router.get('/device/:deviceId', function (req, res, next) {
  res.render('device', {'deviceId': req.params.deviceId, 'title': 'Device'});
});

/* POST to create a new record */
router.post('/api/records/', function (req, res, next) {
  var record = {};
  if (req.body.deviceId) {
    record.deviceId = req.body.deviceId;
  } else {
    // response with error msg
  }
  if (req.body.location) {
    record.location = req.body.location;
  } else {
    // response with err
  }
  if (req.body.timestamp) {
    record.timestamp = new Date(req.body.timestamp);
  }
  dbManager.createRecord(record, function (err, record) {
    if (err) {
      return res.json({'error': err})
    }
    res.json({'record': record});
  })
});

/* GET records for a device with sepecified deviceID */
router.get('/api/records/:deviceId/:pageNum', function (req, res, next) {
  var deviceId = req.query.deviceId;
  var pageNum = req.query.pageNum || 1;
  dbManager.getRecords(deviceId, pageNum, function (err, records) {
    if (err) {
      return res.json({'error': err});
    }
    return res.json({'records': records});
  });
});

module.exports = router;
