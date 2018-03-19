
$(function() {
    $('#calendar').fullCalendar({
        firstDay:1,
        selectable:"true",
        selectHelper:"true",
        eventLimit:"true",
        hiddenDays: [0],
        validRange: function(nowDate) {
            return {
                start: nowDate.clone().add(-3,'days'),
                end: nowDate.clone().add(5, 'months')
            };
        },
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
        events:"assets/json/candidates.json",
        editable:"true",
        navLinks:"true",
        eventClick: function(event, element) {

            event.title = "CLICKED!";

            $('#calendar').fullCalendar('updateEvent', event);

        }
    });
    $('div.fc-toolbar').append("<input class='calendar__input'  type='text' placeholder='jump to date'>");
});