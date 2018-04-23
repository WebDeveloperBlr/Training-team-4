var addedEvents = [];
$(".datepicker").datepicker({
  dateFormat: "yy-mm-dd",
  showAnim: "clip"
});

var eventStart;
var eventEnd;
//var clickTime = [];
var toolbarOptions = [['image'], ['bold'], ['italic'], ['underline'], [{'list': 'ordered'}], [{'list': 'bullet'}], ['link'], ['clean']];

$(function () {
  $('#calendar').fullCalendar({
    firstDay: 1,
    selectable: "true",
    selectHelper: "true",
    eventLimit: "true",
    hiddenDays: [0],
    buttonText: {
      prev: 'prev',
      next: 'next',
      prevYear: 'prev year',
      nextYear: 'next year',
      year: 'year',
      today: 'today',
      month: 'month',
      week: 'week',
      day: 'day',
      listWeek: 'week list',
      listDay: 'day list'
    },
    height: 550,
    defaultView: 'month',
    header: {
      left: 'title ',
      center: 'addEventButton',
      right: 'today prev,next month,agendaWeek,agendaDay, listWeek,listDay'
    },
    displayEventTime: "true",
    
    eventSources: [
      {
        /* events:addedEvents*/
        events: function (start, end, timezone, callback) {
          callback(addedEvents);
        }
      },
      {
        url: "assets/json/candidates.json"
      }
    ],
    editable: "true",
    navLinks: "true",
    allDay: true,
    dayClick: popup,
    eventClick: function (calEvent, jsEvent, view) {
      var firstClick = new Date();
      this.onclick = function () {
        var secondClick = new Date();
        if ((secondClick - firstClick) > 500)
          return;
        var srcEvent;
        for (let p = 0; p < addedEvents.length; p++) {
          if (addedEvents[p].title == calEvent.title) {
            srcEvent = addedEvents[p];
          }
        }
        
        $('#calendar-modal').modal("open"); //open modal window
        
        $("#modal-event-name").val(srcEvent.title);
        
        var date = new EvDate(srcEvent.start, srcEvent.end);
        
        //console.log('srcEvent() ', srcEvent.start);
        //console.log('srcEvent() ', srcEvent.end)
        //console.log('date: ', date);
        //console.log('date.getTimeStart() ', date.getTimeStart());
        //console.log('date.getTimeEnd() ', date.getTimeEnd());
        
        $('#start_date').val(date.getDateStart());
        $('#end_date').val(date.getDateEnd());
        
        $('#checkbox-all-day')[0].checked = srcEvent.allDay;
        if ($('#checkbox-all-day')[0].checked) {
          freezeTime(date);
        }
        else {
          $('#modal-time-start').prop('disabled', false);
          $('#modal-time-end').prop('disabled', false);
          $('#modal-time-start').timepicker('setTime', date.getTimeStart());
          $('#modal-time-end').timepicker('setTime', date.getTimeEnd());
        }
        
        $('#checkbox-all-day').on('click', function () {
          if ($('#checkbox-all-day')[0].checked === false) {
            $('#modal-time-start').prop('disabled', false);
            $('#modal-time-end').prop('disabled', false);
            
            $('#modal-time-start').val(date.getTimeStart());
            $('#modal-time-end').val(date.getTimeEnd());
          }
          if ($('#checkbox-all-day')[0].checked === true) {
            freezeTime(date);
          }
        });
        
        $('#select-repeat').val(srcEvent.repeat);
        $("#event-place").val(srcEvent.place);
        $("#select-interviewer").val(srcEvent.interviewer);
        $('#colorpicker').ddslick('select', {index: srcEvent.colorIndex});
        $("#select-privacy").val(srcEvent.privacy);
        $("#select-video").val(srcEvent.isVideoConf);
        $("#select-vacant").val(srcEvent.isVacant);
        $("select[class*='select-'], select[class^='select-']").material_select();
        quill.setContents(srcEvent.msgText);
        
        $('#modal-submit-lower')[0].onclick = editEvent;
        $('#modal-submit')[0].onclick = editEvent;
        function editEvent() {
          srcEvent.title = $("#modal-event-name").val();
          srcEvent.allDay = $('#checkbox-all-day')[0].checked;
  
          let inputDayStart = $("#start_date").val();
          let inputDayEnd = $("#end_date").val();
  
          if (srcEvent.allDay) {
            srcEvent.start = inputDayStart;
            srcEvent.end = inputDayEnd;
          }
          else {
            date.updateTimeAndDate(
              inputDayStart, inputDayEnd,
              $('#modal-time-start').val(),
              $('#modal-time-end').val()
            );
    
            srcEvent.start = date.start;
            srcEvent.end = date.end;
            
            //console.log('srcEvent.start: ', srcEvent.start);
            //console.log('srcEvent.end: ', srcEvent.end)
          }
          
          srcEvent.place = $("#event-place").val();
          srcEvent.repeat = $('#select-repeat').val();
          srcEvent.interviewer = $("#select-interviewer").val();
          srcEvent.color = $("#colorpicker").data('ddslick').selectedData.value;
          srcEvent.colorIndex = $("#colorpicker").data('ddslick').selectedIndex;
          srcEvent.privacy = $("#select-privacy").val();
          srcEvent.isVideoConf = $("#select-video").val();
          srcEvent.isVacant = $("#select-vacant").val();
          srcEvent.msgText = quill.getContents();
          $("#calendar").fullCalendar('refetchEvents');
          quill.setContents('');
        }
      };
      
    },
    validRange: function (nowDate) {
      return {
        start: nowDate,
        end: nowDate.clone().add(1, 'months')
      };
    }
  });
  $('#calendar-modal').modal({
    dismissible: true, // Modal can be dismissed by clicking outside of the modal
    endingTop: '4%'
  });
  $("select[class*='select-'], select[class^='select-']").material_select(); //initializing selects
  $('ul.tabs').tabs(); //initializing material tabs
  var quill = new Quill('#editor', {
    theme: 'snow',
    placeholder: 'Add description',
    modules: {
      toolbar: toolbarOptions
    }
  }); //initializing wysiwyg window for texteditor
  
  $('#modal-time-start, #modal-time-end').timepicker({
    'minTime': '7:00am',
    'maxTime': '21:30pm'
  }); //initializing timepicker
  
  $('#colorpicker').ddslick({
    width: '55px',
    defaultSelectedIndex: 1
  }); //initializing select for colorpicker
  
});

function freezeTime(date) {
  $('#modal-time-start').timepicker('setTime', null);
  $('#modal-time-end').timepicker('setTime', null);
  $('#modal-time-start').prop('disabled', true);
  $('#modal-time-end').prop('disabled', true);
}

function popup(date, jsEvent, view) {
  $(".schedule__pop-up").removeClass("display-none");
  eventStart = date.format();
  eventEnd = date.format();
  $("#eventStart").val(eventStart);
  $("#eventEnd").val(eventEnd);
  var inputTitle = document.getElementById("eventTitle");
  inputTitle.focus();
  inputTitle.onkeydown = function (ev) {
    if (ev.keyCode == 13) {
      var eventClick = new Event("click");
      var saveEventBtn = document.getElementById("saveEvent");
      saveEventBtn.dispatchEvent(eventClick);
    }
  }
}

$(".schedule-popup-close").click(function () {
  $(".schedule__pop-up").addClass("display-none");
});

$("#saveEvent").click(function () {
  var title = $("#eventTitle").val();
  var newEvent = new EventCreator(eventStart, eventEnd, title);
  addedEvents.push(newEvent);
  $(".schedule__pop-up").addClass("display-none");
  $("#eventTitle").val("");
  $("#eventStart").val("");
  $("#eventEnd").val("");
  $("#calendar").fullCalendar('refetchEvents');
});

function EventCreator(start, end, title) {
  this.title = title;
  this.start = start;
  this.end = end;
  this.allDay = true;
  this.repeat = 0;
  this.place = '';
  this.interviewer = 0;
  this.color = '';
  this.colorIndex = 0;
  this.privacy = 1;
  this.isVideoConf = 0;
  this.isVacant = 1;
}

function EvDate(_start, _end) {
  let that = this;
  
  this.start = _start;
  this.end = _end;
  
  this.formatDate = 'YYYY-MM-D';
  this.formatTime = 'hh:mma';
  
  
  this.momentStart = moment(that.start);
  this.momentEnd = moment(that.end);
  //console.log("momentStart ", that.momentStart);
  //console.log('momentEnd ', that.momentEnd)
  
  this.getDateStart = function () {
    return that.momentStart.format(that.formatDate);
  }
  
  this.getDateEnd = function () {
    return that.momentEnd.format(that.formatDate);
  }
  
  this.getTimeStart = function () {
    return that.momentStart.format(that.formatTime);
  }
  
  this.getTimeEnd = function () {
    return that.momentEnd.format(that.formatTime);
  }
  /*this.getTimeStartAllDay = function () {
    return that.momentStart.hours(7).minutes(0).format(that.formatTime);
  }
  
  this.getTimeEndAllDay = function () {
    return that.momentEnd.hours(21).minutes(30).format(that.formatTime);
  }
  */
  
  this.setDate = function (s, e) {
    that.momentStart = moment(s, that.formatDate);
    that.momentEnd = moment(e, that.formatDate);
  }
  
  this.setTime = function (s, e) {
    that.momentStart.hours(moment(s, that.formatTime).hours());
    that.momentStart.minutes(moment(s, that.formatTime).minutes());
    
    that.momentEnd.hours(moment(e, that.formatTime).hours());
    that.momentEnd.minutes(moment(e, that.formatTime).minutes());
  };
  
  
  this.updateTimeAndDate = function (stDate, endDate, stTime, endTime) {
    that.setDate(stDate, endDate);
    that.setTime(stTime, endTime);
    
    that.start = that.momentStart.format();
    that.end = that.momentEnd.format();
    
    //console.log('updateTimeAndDate that.start', that.start);
    //console.log('updateTimeAndDate that.end', that.end);
    
    
  }
  
  
}

