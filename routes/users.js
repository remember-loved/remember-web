'use strict';
var express = require('express');
var dbManager = require('../models/DBManager');
var router = express.Router();

/*Create a new user*/
router.post('/', function (req, res, next) {
  var user = {};
  var location = {};
  if (req.body.userName) {
    user.userName = req.body.userName;
  } else {
    // response with error msg
  }
  if (req.body.userEmail) {
    user.userEmail = req.body.userEmail;
  } else {
    // response with error msg
  }
  if (req.body.password) {
    user.password = req.body.password;
  } else {
    // response with err
  }
  if (req.body.deviceId) {
    location.longitude = req.body.longitude;
    location.latitude = req.body.latitude;
    user.relativeDeviceIds = [{
      deviceId: req.body.deviceId,
      location: JSON.stringify(location),
      range: req.body.range
    }];
  } else {
    // response with err
  }
  dbManager.createUser(user, function (err, createdUser) {
    if (err) {
      console.log(user);
      return next(err);
    }
    res.redirect('/login');
  });
});

/*Get information about a user*/
router.get('/:userName', function (req, res, next) {
  var userName = req.params.userName;
  dbManager.getUserByName(userName, function (err, user) {
    if (err) {
      return next(err);
    }
    res.render('user', {'user': user, 'title': user.userName});
  });
});

/*Get information about a user*/
router.get('/:userName/edit', function (req, res, next) {
  var userName = req.params.userName;
  dbManager.getUserByName(userName, function (err, user) {
    if (err) {
      return next(err);
    }
    res.render('user-edit', {'user': user, 'title': 'Edit ' + user.userName});
  });
});

/*Update a user's information*/
router.post('/:userName', function (req, res, next) {
  var userName = req.params.userName;
  var updateUser = {};
  var location = {};
  if (req.body.deviceId) {
    location.longitude = req.body.longitude;
    location.latitude = req.body.latitude;
    updateUser.relativeDeviceIds = [{
      deviceId: req.body.deviceId,
      location: JSON.stringify(location),
      range: req.body.range
    }];
  } else {
    // response with err
  }
  dbManager.updateUserDevicesByName(userName, updateUser, function (err, user) {
    if (err) {
      return next(err);
    }
    res.render('user', {'user': user, 'title': user.userName});
  });
});

module.exports = router;
