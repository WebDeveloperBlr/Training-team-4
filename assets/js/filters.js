
$(document).ready(function () {

  let rows = $(".vacancies-block__table__row");
  let cols = $(".vacancies-block__table-col")
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

  $("#vacancies-block__filters-bar__sort-button").on('click', toFilter());


});


