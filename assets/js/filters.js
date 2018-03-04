
$(document).ready(function () {

  let rows = $(".vacancies-block__table__row");
  let cols = $(".vacancies-block__table-col");
  let experiences = ["any", "junior", "middle", "senior"];

  let filter = {
    curExpIndex: $("#vacancies-block__filters-bar__select--exp option:selected").index(),
    curSalFrom: $("#vacancies-block__filters-bar__input--salary-from").val(),
    curSalTo: $("#vacancies-block__filters-bar__input--salary-to").val(),
    curPos: $("#vacancies-block__filters-bar__input--pos").val()
  };

  function toFilter() {
    rows.hide().filter(function (row) {
      // покажет те ряды, где 3 функции возвращают true;
      return filterPos($(row).find(cols)[0]) && filterExp($(row).find(cols)[1]) && filterSal($(row).find(cols)[2]);
    }).show();
  }

  //position
  function filterPos(elem) {
    if (filter.curPos === "")
      return true;

    return elem.innerText.toLowerCase().indexOf(filter.curPos);
  }

  //work experience
  function filterExp(elem) {
    if (filter.curExpIndex === experiences["any"]) //check for 'any'
      return true;

    return elem.innerText.toLowerCase().indexOf(experiences[filter.curExpIndex]);
  }

  //salary
  function filterSal(elem) {
    if(!filter.curSalFrom && !filter.curSalFrom)
      return true;

    if (filter.curSalFrom === '')  filter.curSalFrom = 0;
    if (filter.curSalFrom === '')  filter.curSalTo = 0;

    //cut '$' sign
    let sum = parseInt(elem.innerText.slice(1));

    if(sum >= filter.curSalFrom && sum <= filter.curSalTo)
      return true;
    else
      return false;
  }

  $("#vacancies-block__filters-bar__sort-button").bind('click', toFilter());



  /*** рабочая функция, c $().on() не работает ***/
  function sortTable(n) {
    let table, rows, switching, i, x, y, shouldSwitch, switchcount = 0;
    let textCurItem, textNextItem;
    let dir = "asc";
    switching = true;

    while (switching) {
      switching = false;
      rows = $('.vacancies-block__table__row');

      for (i = 0; i < (rows.length - 1); i++) {

        shouldSwitch = false;// Start by saying there should be no switching:
        /* Get the two elements you want to compare,
        one from current row and one from the next: */

        x = ($(".vacancies-block__table-col", rows[i]))[n];
        y = ($(".vacancies-block__table-col", rows[i + 1]))[n];

        textCurItem = x.innerText.toLowerCase();
        textNextItem = y.innerText.toLowerCase();

        if (n == 2) {
          textCurItem = parseInt(textCurItem.slice(1));
          textNextItem = parseInt(textNextItem.slice(1));
        }

        /* Check if the two rows should switch place,
        based on the direction, asc or desc: */

        if (dir == "asc") {
          if (textCurItem > textNextItem) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        } else if (dir == "desc") {
          if (textCurItem < textNextItem) {
            shouldSwitch = true;// If so, mark as a switch and break the loop:
            break;
          }
        }
      }
      if (shouldSwitch) {
        /* If a switch has been marked, make the switch
        and mark that a switch has been done: */
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        // Each time a switch is done, increase this count by 1:
        switchcount++;
      } else {
        /* If no switching has been done AND the direction is "asc",
        set the direction to "desc" and run the while loop again. */

        if (switchcount == 0 && dir === "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
  }

  $('#table--header-col--pos').bind('click', sortTable(0));
  $('#table--header-col--exp').bind('click', sortTable(1));
  $('#table--header-col--sal').bind('click', sortTable(2))

});



