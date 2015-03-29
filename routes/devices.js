'use strict';
var express = require('express');
var dbManager = require('../models/DBManager');
var router = express.Router();

/*Create a new record*/
router.post('/', function (req, res, next) {
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

/*Get information about a device*/
router.get('/:deviceId', function (req, res, next) {
  res.render('device', {'deviceId': req.params.deviceId, 'title': 'Device'});
});

module.exports = router;
