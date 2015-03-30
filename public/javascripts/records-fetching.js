/* global $: false , console: false */
'use strict';
$(document).ready(function () {
  var pageNum = 1;
  var deviceId = $('#device-form input[name=deviceId]').val();
  var userName = $('#device-form input[name=userName]').val();
  var requestForRecords = function (inputData, doneHandler, failHanlder) {
    var apiUrl = '/api/records/' + deviceId;
    $.get(apiUrl, inputData)
      .done(doneHandler)
      .fail(failHanlder);
  };
  requestForRecords({
    'pageNum': pageNum,
    'userName': userName
  }, function (data) {
    if (data.error) {
      return window.alert('Unexpected error happened when requesting for new records');
    }
    console.log(data);
    $('#records-list').show();
    var sampleItem = $('#records-list #sample-item');
    var newItem;
    var location;
    var locationContent;
    for (var i = data.records.length - 1; i >= 0; i--) {
      newItem = sampleItem.clone();
      newItem.show().attr('id', 'records-' + i);
      location = JSON.parse(data.records[i].location.replace(new RegExp('\'', 'g'), '\"'));
      locationContent = 'Longitute: ' + location.longitude + '; Latitude: ' + location.latitude;
      newItem.find('.content .description .location span').html(locationContent);
      newItem.find('.content .description .time span').html(data.records[i].timestamp.slice(0, 10)
        + ' ' + data.records[i].timestamp.slice(11, 19));
      newItem.appendTo('#records-list');
    }
  }, function (err) {
    window.alert('Unexpected error happened when requesting for new records');
  });
});
