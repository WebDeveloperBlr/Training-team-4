var request = new XMLHttpRequest();
var vacancies = [];
var table = document.getElementsByClassName('vacancies-block__table')[0];
var cellsValues;
var numbVacancies;
var col;
var row;
var link;

request.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
        vacancies = JSON.parse(this.responseText);
        numbVacancies = vacancies.length;
        for (var i = 0; i < numbVacancies; i++) {
            row = document.createElement("div");
            row.className = "vacancies-block__table__row table--row table-row--big";
            table.appendChild(row);
            cellsValues = Object.values(vacancies[i]);
            for (var j = 0; j < 3; j++) {
                col = document.createElement("div");
                col.className = "vacancies-block__table-col";
                col.appendChild(document.createTextNode(cellsValues[j]));
                row.appendChild(col);
            }
            col = document.createElement("div");
            col.className = "vacancies-block__table-col";
            row.appendChild(col);
            link = document.createElement("a");
            link.href = "#";
            link.appendChild(document.createTextNode(cellsValues[3]));
            col.appendChild(link);
        }
    }
};
request.open("GET", "assets/json/vacancies.json", true);
request.send();
