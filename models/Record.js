var mongoose = require('mongoose');

var recordSchema = new mongoose.Schema({
  deviceId: {type: String, required: true},
  location: {type: String, required: true},
  timestamp: {type: Date, default: Date.now}
});

var Record = mongoose.model('Record', recordSchema);

module.exports = Record;
