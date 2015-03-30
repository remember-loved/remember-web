/* global $: false , console: false */
'use strict';
$(document).ready(function () {
  var pageNum = 1;
  var deviceId = $('#device-form input[name=deviceId]').val();
  var userName = $('#device-form input[name=userName]').val();
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
      return window.alert('Unexpected error happened when requesting for new records');
    }
    if (!data.records.length) {
      console.log('done with loading');
      isLoadingDone = true;
    }
    $('#records-list').show();
    var sampleItem = $('#records-list #sample-item');
    var newItem;
    var location;
    var locationContent;
    for (var i = data.records.length - 1; i >= 0; i--) {
      newItem = sampleItem.clone();
      newItem.show().attr('id', 'records-' + i);
      try {
        location = JSON.parse(data.records[i].location.replace(new RegExp('\'', 'g'), '\"'));
        locationContent = 'Longitute: ' + location.longitude + '; Latitude: ' + location.latitude;
        newItem.find('.content .description .location span').html(locationContent);
        newItem.find('.content .description .time span').html(data.records[i].timestamp.slice(0, 10) +
          ' ' + data.records[i].timestamp.slice(11, 19));
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
