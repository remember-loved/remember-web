'use strict';
var map;
function initialize() {
  var mapCenter = new google.maps.LatLng(1.2967181, 103.7763725);
  var mapOptions = {
    zoom: 15,
    center: mapCenter
  };
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  function displayingLocationMarkers() {
    var pageNum = 1;
    var userName = $('#device-form input[name=userName]').val();
    var deviceId = $('#device-form input[name=deviceId]').val();
    var requestForRecords = function (doneHandler, failHanlder) {      
      var inputData = {
        'pageNum': pageNum,
        'userName': userName
      };
      var apiUrl = '/api/records/' + deviceId;
      $.get(apiUrl, inputData)
        .done(doneHandler)
        .fail(failHanlder);
    };

    var requestDoneHandler = function (data) {
      if (data.error) {
        return window.alert('Unexpected error happened when requesting for new records');
      }
      for (var i = 0; i < data.records.length; i++) {
        if (i === 0) {
          makingMarkerForRecord(data.records[i]);
        } else {
          makingMarkerForRecord(data.records[i], '/images/map-marker-blue.png');
        }
      }
      pageNum++;
    };
    var requestFailHanlder = function (err) {
      console.log('Error in records-fetching:', err.message);
      window.alert('Unexpected error happened when requesting for new records');
    };
    requestForRecords(requestDoneHandler, requestFailHanlder);

    function makingMarkerForRecord(record, imagePath) {
      var location, timestamp, marker;
      try {
        location = JSON.parse(record.location.replace(new RegExp('\'', 'g'), '\"'));
        timestamp = new Date(record.timestamp);
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(location.longitude, location.latitude),
          title: timestamp.toString().substring(4, 24),
          map: map
        });
      } catch (err) {
        console.log('Error in displaying marker' + err.message);
      }
      marker.setMap(map);
    }
  }

  setTimeout(displayingLocationMarkers, 3000);
}

google.maps.event.addDomListener(window, 'load', initialize);

var getDistance = function(p1, p2) {
  var rad = function(x) {
    return x * Math.PI / 180;
  };
  var R = 6378137; // Earth's mean radius in meter
  var dLat = rad(p2.latitude - p1.latitude);
  var dLong = rad(p2.longitude - p1.longitude);
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(p1.latitude)) * Math.cos(rad(p2.latitude)) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;

  return d; // returns the distance in meter
};
