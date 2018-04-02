
var addedEvents = [];
$(".datepicker").datepicker({
    dateFormat: "yy-mm-dd",
    showAnim: "clip"
});

var eventStart;
var eventEnd;
//var clickTime = [];
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
        height: 550,
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
        //old version of double click
        /*
         function(date, jsEvent, view) {
           clickTime.push(jsEvent.timeStamp);
           if (clickTime.length === 1) {
             setTimeout(function () {
               if (clickTime.length === 1) {
                 clickTime.splice(0, clickTime.length);
                 popup();
               }
             }, 500);
           }
           else {
             console.log(jsEvent);
             clickTime.splice(0, clickTime.length);
           }
         },
         */
        
        //for event double click (editing)
      /*  eventRender:function(event1, element) {

        element.bind('dblclick', function() {
            var event;
            for(var count=0;count<addedEvents.length;count++){
                if(event1.title==addedEvents[count].title&& event1.start==addedEvents[count].start)
                    event=addedEvents[count];
            }
        $('#calendar-modal').modal("open"); //open modal window
        
        //setting event values into the modal
        $("#modal-event-name").val(event.title);
        $('#start_date').val(event.start._i);
        $('#end_date').val(event.start._i);
        $('#checkbox-all-day')[0].checked = event.allDay;
        $("#event-place").val(event.place);
        $("#select-interviewer").val(event.interviewer);
        $("#colorpicker").data('ddslick').selectedData.value = event.color;
        $("#select-privacy").val(event.privacy);
        $("#select-video").val(event.isVideoConf);
        $("#select-vacant").val(event.isVacant);
        quill.setContents(event.msgText);
      
        //for both submit buttons
        $("#modal-submit, #modal-submit-lower").click(function() {
          event.title = $("#modal-event-name").val();
          event.start = $("#start_date").val();
          //event.end = $("#start_end").val();
          event.allDay = $('#checkbox-all-day')[0].checked;
          event.place = $("#event-place").val();
          event.interviewer =  $("#select-interviewer").val();
          event.color =  $("#colorpicker").data('ddslick').selectedData.value;
          event.privacy =  $("#select-privacy").val();
          event.isVideoConf =  $("#select-video").val();
          event.isVacant =  $("#select-vacant").val();
          event.msgText = quill.getContents();

            $("#calendar").fullCalendar('refetchEvents');
          
          quill.setContents('');
        });
      });
    },*/
      eventClick: function(calEvent, jsEvent, view) {
          var firstClick=new Date();
          this.addEventListener("click",function(){
          var secondClick=new Date();
          if((secondClick-firstClick)>500)
              return;
          var event;
          for(var p=0;p<addedEvents.length;p++){
              if(addedEvents[p].title==calEvent.title)
                  event=addedEvents[p];
          }
         $('#calendar-modal').modal("open"); //open modal window
         $("#modal-event-name").val(event.title);
         $('#start_date').val(event.start);
         $('#end_date').val(event.start);
         $('#checkbox-all-day')[0].checked = event.allDay;
         $("#event-place").val(event.place);
         $("#select-interviewer").val(event.interviewer);
         $("#colorpicker").data('ddslick').selectedData.value = event.color;
         $("#select-privacy").val(event.privacy);
         $("#select-video").val(event.isVideoConf);
         $("#select-vacant").val(event.isVacant);
         quill.setContents(event.msgText);



         $("#modal-submit, #modal-submit-lower").click(function(k) {
             event.title = $("#modal-event-name").val();
             event.start = $("#start_date").val();
             //event.end = $("#start_end").val();
             event.allDay = $('#checkbox-all-day')[0].checked;
             event.place = $("#event-place").val();
             event.interviewer =  $("#select-interviewer").val();
             event.color =  $("#colorpicker").data('ddslick').selectedData.value;
             event.privacy =  $("#select-privacy").val();
             event.isVideoConf =  $("#select-video").val();
             event.isVacant =  $("#select-vacant").val();
             event.msgText = quill.getContents();

                  $("#calendar").fullCalendar('refetchEvents');

                  quill.setContents('');
              });
          $("#calendar").fullCalendar('refetchEvents');
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
  $("select[class*='select-'], select[class^='select-']").material_select(); //initializing selects
  $('ul.tabs').tabs(); //initializing material tabs
  var quill = new Quill('#editor', {
    theme: 'snow',
    placeholder: 'Добавьте описание',
    modules: {
      toolbar: toolbarOptions
    }
  }); //initializing wysiwyg window for texteditor
  $('#modal-time-start, #modal-time-end').timepicker({}); //initializing timepicker
  $('#colorpicker').ddslick({
    width: '55px'
  }); //initializing select for colorpicker
  
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
