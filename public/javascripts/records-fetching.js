/* global $: false , console: false */
'use strict';
$(document).ready(function () {
  var pageNum = 1;
  var deviceId = $('#device-form input[name=deviceId]').val();
  var userName = $('#device-form input[name=userName]').val();
  var safeLocation;
  var safeRange
  try {
    safeLocation = JSON.parse($('#device-form input[name=userLocation]').val().replace(new RegExp('\'', 'g'), '\"'));
    safeLocation.longitude = parseFloat(safeLocation.longitude);
    safeLocation.latitude = parseFloat(safeLocation.latitude);
    safeRange = parseFloat($('#device-form input[name=userRange]').val());
  } catch (error) {
    // nothing to be done
  }
  var isLoadingDone = false;
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
      return window.alert(data.error);
    }
    if (!data.records.length) {
      console.log('done with loading');
      isLoadingDone = true;
    }
    $('#records-list').show();
    var sampleItem = $('#records-list #sample-item');
    var newItem;
    var location;
    var timestamp;
    var locationContent;
    for (var i = 0; i < data.records.length; i++) {
      newItem = sampleItem.clone();
      newItem.show().attr('id', 'records-' + i);
      try {
        location = JSON.parse(data.records[i].location.replace(new RegExp('\'', 'g'), '\"'));
        locationContent = 'Longitude: ' + location.longitude + '; Latitude: ' + location.latitude;
        newItem.find('.content .description .location span').html(locationContent);
        timestamp = new Date(data.records[i].timestamp);
        newItem.find('.content .description .time span').html(timestamp.toString().substring(4, 24));
        if (location && safeLocation && getDistance(location, safeLocation) > safeRange) {
          newItem.addClass('highlight-red');
        }
        newItem.appendTo('#records-list');
      } catch (err) {
        // nothing to be done
      }
    }
    pageNum++;
    if (!isLoadingDone) {
      $(window).bind('scroll', bindScroll);
    }
  };
  var requestFailHanlder = function (err) {
    console.log('Error in records-fetching:', err.message);
    window.alert('Unexpected error happened when requesting for new records');
  };
  requestForRecords(requestDoneHandler, requestFailHanlder);

  var bindScroll = function () {
    if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
      $(window).unbind('scroll');
      requestForRecords(requestDoneHandler, requestFailHanlder);
    }
  }
});

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
  
  return d / 1000; // returns the distance in kilometer
};
