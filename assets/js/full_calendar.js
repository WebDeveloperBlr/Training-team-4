$( "#datepicker" ).datepicker({
    dateFormat: "yy-mm-dd"
});

function eventCreator (date, jsEvent, view) {
    alert("u have clicked!!");
}


var addedEvents=[
    {
        title:"HUI",
        start:"2018-04-30",
        end:"2018-04-30"
    }
];
$(function() {
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
        dayClick:eventCreator,
        validRange: function(nowDate) {
            return {
                start: nowDate,
                end: nowDate.clone().add(1, 'months')
            };
        }
    });
});
$( function() {
    $( "#datepicker" ).datepicker();
} );