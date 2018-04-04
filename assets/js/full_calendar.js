
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
        eventClick: function(calEvent, jsEvent, view) {
            var firstClick=new Date();
            this.onclick=function(){
                var secondClick=new Date();
                if((secondClick-firstClick)>500)
                    return;
                var srcEvent;
                for(let p=0;p<addedEvents.length;p++){
                    if(addedEvents[p].title==calEvent.title)
                        srcEvent=addedEvents[p];
                }
                $('#calendar-modal').modal("open"); //open modal window
                $("#modal-event-name").val(srcEvent.title);
                $('#start_date').val(srcEvent.start);
                $('#end_date').val(srcEvent.start);
                $('#checkbox-all-day')[0].checked = srcEvent.allDay;
                $("#event-place").val(srcEvent.place);
                $("#select-interviewer").val(srcEvent.interviewer);
                $("#colorpicker").data('ddslick').selectedData.value = srcEvent.color;
                $("#select-privacy").val(srcEvent.privacy);
                $("#select-video").val(srcEvent.isVideoConf);
                $("#select-vacant").val(event.isVacant);
                quill.setContents(srcEvent.msgText);

                var submitBtn=document.getElementById("modal-submit");
                submitBtn.onclick=function() {
                    srcEvent.title = $("#modal-event-name").val();
                    srcEvent.start = $("#start_date").val();
                    srcEvent.allDay = $('#checkbox-all-day')[0].checked;
                    srcEvent.place = $("#event-place").val();
                    srcEvent.interviewer = $("#select-interviewer").val();
                    srcEvent.color = $("#colorpicker").data('ddslick').selectedData.value;
                    srcEvent.privacy = $("#select-privacy").val();
                    srcEvent.isVideoConf = $("#select-video").val();
                    srcEvent.isVacant = $("#select-vacant").val();
                    srcEvent.msgText = quill.getContents();
                    $("#calendar").fullCalendar('refetchEvents');
                    quill.setContents('');
                }
            };

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
    var inputTitle=document.getElementById("eventTitle");
    inputTitle.focus();
    inputTitle.onkeydown=function(ev){
        if(ev.keyCode==13) {
            var eventClick = new Event("click");
            var saveEventBtn = document.getElementById("saveEvent");
            saveEventBtn.dispatchEvent(eventClick);
        }
    }
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

