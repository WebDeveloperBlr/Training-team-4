
var addedEvents = [];
$(".datepicker").datepicker({
    dateFormat: "yy-mm-dd",
    showAnim: "clip"
});

var eventStart;
var eventEnd;
var clickTime = [];
var toolbarOptions = [['image'], ['bold'], ['italic'], ['underline'], [{ 'list': 'ordered'}], [{ 'list': 'bullet' }], ['link'], ['clean']];



$(function () {
  $('#calendar').fullCalendar({
        firstDay:1,
        selectable:"true",
        selectHelper:"true",
        eventLimit:"true",
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
            listWeek:'week list',
            listDay:'day list'
        },
        height:550,
        defaultView: 'month',
        header: {
            left: 'title ',
            center: 'addEventButton',
            right: 'today prev,next month,agendaWeek,agendaDay, listWeek,listDay'
        },
        displayEventTime: "true",

        eventSources:[
            {
                /* events:addedEvents*/
                events: function(start, end, timezone, callback){
                    callback(addedEvents);}
            },
            {
                url:"assets/json/candidates.json"
            }
        ],
        editable:"true",
        navLinks:"true",
        allDay:true,
        dayClick: popup,
        /*
         function(date, jsEvent, view) {
            clickTime.push(jsEvent.timeStamp);
            if(clickTime.length === 1) {
              setTimeout(function () {
                if(clickTime.length === 1) {
                  clickTime.splice(0, clickTime.length);
                  popup();
                }
              }, 500);
            }
            else {
              modalWide();
              clickTime.splice(0, clickTime.length);
            }
         */
        
        //for event double click
        eventRender:function(event, element) {
          element.bind('dblclick', function() {
            console.log(event.allDay);
            $('#calendar-modal').modal("open");
            $("#modal-event-name").val(event.title);
            $('#modal-allDay')[0].checked = event.allDay;
            $('#start_date').val(event.start._i);
            $('#end_date').val(event.start._i);
            
            $("#modal-submit-lower, #modal-submit").click(function() {
              
              event.title = $("#modal-event-name").val();
              event.start = $("#start_date").val();
              event.end = $("#end_date").val();
              event.allDay = $('#modal-allDay')[0].checked;
              $('#calendar').fullCalendar('updateEvent', event);
            });
          });
        },
        validRange: function(nowDate) {
            return {
                start: nowDate,
                end: nowDate.clone().add(1, 'months')
            };
        }
    });
  $('#calendar-modal').modal({
    dismissible: true, // Modal can be dismissed by clicking outside of the modal
    endingTop: '5%' // Ending top style attribute
  });
  $("select[class*='select-'], select[class^='select-']").material_select();
  $('ul.tabs').tabs();
  var quill = new Quill('#editor', {
    theme: 'snow',
    placeholder: 'Добавьте описание',
    modules: {
      toolbar: toolbarOptions
    }
  });
  $('#event-time-start, #event-time-end').timepicker({});
  $('#colorpicker').ddslick({
    width: '55px'
  });
  
});

function popup (date, jsEvent, view) {
    $(".schedule__pop-up").removeClass("display-none");
    eventStart = date.format();
    eventEnd = date.format();
    $("#eventStart").val(eventStart);
    $("#eventEnd").val(eventEnd);
}

$(".schedule-popup-close").click(function() {
    $(".schedule__pop-up").addClass("display-none");
});

$("#saveEvent").click(function(){
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
}
