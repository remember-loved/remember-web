'use strict';
var Record = require('../models/Record');
var User = require('../models/User');

var dbManager = {};

var LIMIT_OF_RECORD_PER_CALL = 20;

/// UserDB related
dbManager.getUserByName = function (userName, callback) {
  User.findOne({'userName': userName}).exec(callback);
};

dbManager.getUserById = function (userId, callback) {
  User.findById(userId, callback);
};

dbManager.createUser = function (userToAdd, callback) {
  User.create(userToAdd, callback);
};

dbManager.addDeviceIdForUser = function (origUser, deviceId, callback) {
  User.findOne({'userEmail': origUser.userEmail}, function (err, user) {
    if (err) {
      callback(err);
    }
    if (user.relativeDeviceIds.indexOf(deviceId) === -1) {
      user.relativeDeviceIds.push(deviceId);
    }
    user.save(callback);
  });
};

/// RecordDB Related
dbManager.getRecords = function (deviceId, pageNum, callback) {
  var skipNum = (pageNum || 1) - 1;
  Record.find({'deviceId': deviceId})
    .sort({'timestamp': -1})
    .skip(skipNum * LIMIT_OF_RECORD_PER_CALL)
    .limit(LIMIT_OF_RECORD_PER_CALL)
    .exec(callback);
};

dbManager.createRecord = function (recordToCreate, callback) {
  Record.create(recordToCreate, callback);
};

module.exports = dbManager;
