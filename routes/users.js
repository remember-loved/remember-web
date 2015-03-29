'use strict';
var express = require('express');
var dbManager = require('../models/DBManager');
var router = express.Router();

/*Create a new user*/
router.post('/', function (req, res, next) {
  var user = {};
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
    user.relativeDeviceIds = [req.body.deviceId];
  } else {
    // response with err
  }
  dbManager.createUser(user, function (err, createdUser) {
    if (err) {
      console.log(user);
      return next(err);
    }
    res.redirect('/users/' + createdUser.userName);
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

module.exports = router;
