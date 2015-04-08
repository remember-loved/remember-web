'use strict';
function initialize() {
  var mapCenter = new google.maps.LatLng(1.2967181, 103.7763725);
  var mapOptions = {
    zoom: 15,
    center: mapCenter
  };
  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

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
          makingMarkerForRecord(data.records[i], '/images/map-marker-black.png');
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
          map: map,
          title: timestamp.toString().substring(4, 24),
          icon: imagePath
        });
      } catch (err) {
        // nothing to be done
      }
    }
  }

  displayingLocationMarkers();
}

google.maps.event.addDomListener(window, 'load', initialize);
