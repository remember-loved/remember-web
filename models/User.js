var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  userName: {type: String, required: true, unique: true},
  userEmail: {type: String, required: true},
  password: {type: String, required: true},
  relativeDeviceIds: [{
    deviceId: String,
    location: String,
    range: Number
  }]
});

var User = mongoose.model('User', userSchema);

module.exports = User;
