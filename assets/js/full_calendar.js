

$( ".datepicker" ).datepicker({
    dateFormat: "yy-mm-dd",
    showAnim: "clip"
});

var eventStart;
var eventEnd;

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
                events:addedEvents
            },
            {
                url:"assets/json/candidates.json"
            }
        ],
        editable:"true",
        navLinks:"true",
        allDay:true,
        dayClick:popup,
        validRange: function(nowDate) {
            return {
                start: nowDate,
                end: nowDate.clone().add(1, 'months')
            };
        }
    });
});

function popup (date, jsEvent, view) {
    $(".schedule__pop-up").removeClass("display-none");
    eventStart=date.format();
    eventEnd=date.format();
    $("#eventStart").val(eventStart);
    $("#eventEnd").val(eventEnd);
}

$(".schedule-popup-close").click(function(){
    $(".schedule__pop-up").addClass("display-none");
});

$("#saveEvent").click(function(){
    var title=$("#eventTitle").val();
    var newEvent=new EventCreator(eventStart,eventEnd,title);
    addedEvents.push(newEvent);
    $(".schedule__pop-up").addClass("display-none");
    $("#eventTitle").val("");
    $("#eventStart").val("");
    $("#eventEnd").val("");
    $(".schedule__pop-up").addClass("display-none");
});


function EventCreator(start,end,title){
    this.title=title;
    this.start=start;
    this.end=end;
}

var addedEvents=[
    {
        title:"HUI",
        start:"2018-04-30",
        end:"2018-04-30"

    }
];
