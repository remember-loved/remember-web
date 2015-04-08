'use strict';
var express = require('express');
var router = express.Router();
var dbManager = require('../models/DBManager');
var passport = require('passport');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {title: 'Remember loved ones', 'user': req.user});
});

/* GET signup page. */
router.get('/signup', function (req, res, next) {
  res.render('signup', {title: 'Sign Up'});
});

/* GET login page */
router.get('/login', function (req, res, next) {
  res.render('login', {title: 'Login'});
});

/* POST to log user in */
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
  if (!req.user) {
    return next(new Error('Please login first to view the page'));
  }
  res.render('device', {'deviceId': req.params.deviceId, 'title': 'Device', 'user': req.user});
});

/* GET device map page */
router.get('/device-map/:deviceId', function (req, res, next) {
  if (!req.user) {
    return next(new Error('Please login first to view the page'));
  }
  res.render('device-map', {'deviceId': req.params.deviceId, 'title': 'Device Map', 'user': req.user});
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

/* GET records for a device with specified deviceID */
router.get('/api/records/:deviceId', function (req, res, next) {
  var deviceId = req.params.deviceId;
  var pageNum = req.query.pageNum || 1;
  var userName = req.query.userName;
  var user = req.user;
  if (!user) {
    return res.json({'error': 'No such user'});
  }
  function isUserAbleToViewDevice(user, deviceId) {
    if (!user) {
      return false;
    }
    var isAbleTo = false;
    for (var i = 0; i < user.relativeDeviceIds.length; i++) {
      if (user.relativeDeviceIds[i].deviceId === deviceId) {
        isAbleTo = true;
        return isAbleTo;
      }
    }
    return isAbleTo;
  }
  if (!isUserAbleToViewDevice(user, deviceId)) {
    return res.json({'error': 'You are not allowed to view current device'});
  }
  dbManager.getRecords(deviceId, pageNum, function (err, records) {
    if (err) {
      return res.json({'error': err});
    }
    return res.json({'records': records});
  });
});

module.exports = router;
