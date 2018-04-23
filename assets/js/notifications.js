var bell = document.getElementById("right-bell");
var menu = document.getElementById("notificationMenu");
var notifContainer = document.getElementById("notifsContainer");
var interviewContainer=document.getElementById("interview-container");
var nextInterviews, newCandidates;

function renderCandidates(){
  newCandidates.forEach(function (row, i, results) {
    var newEl = document.createElement("div");
    newEl.className = "notification";
    newEl.innerHTML = '<img class="notification__img" src="https://www.meme-arsenal.com/memes/31b51255d61f1c9ff104146e59a30790.jpg">\n' +
      '<span class="notification__name">' + row.firstName + " " + row.secondName + '</span>\n' +
      '<span class="notification__salary">' + row.salary + "$" + '</span>\n' +
      '<span class="notification__position">' + row.name + '</span>\n' +
      '<button class="notification__close" data-close="">X</button>';
    notifContainer.append(newEl);
  });
}

function sortByDate(array) {
  array.sort(function (a, b){
    return new Date(b.dateStart) - new Date(a.dateStart);
  })
}



function renderInterviews(a,b){
  sortByDate(nextInterviews);
  for(a;a<b;a++){
    var div=document.createElement("div");
    div.className="notification";
    div.innerHTML="<span class=\"notification__title\">"+nextInterviews[a].title+"</span>\n" +
      "<span class=\"notification__start\">"+nextInterviews[a].dateStart.split('T')[0]+" — "+nextInterviews[a].dateEnd.split('T')[0]+"</span>\n" +
      "<button class=\"notification__close\" data-close=\"\">X</button>";
    interviewContainer.append(div);
  }
}

function xhrConfigure(method,url,reaction){
  var xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  xhr.setRequestHeader("Content-type", 'application/json; charset=utf-8');
  xhr.send();
  xhr.onreadystatechange=reaction;
}

bell.addEventListener("click", function () {
  menu.classList.toggle("_active");
});
notifContainer.addEventListener("click", function (event) {
  var target = event.target;
  if (target.tagName == "BUTTON") {
    $(target.parentNode).slideUp();
  }
  else return;
});

(function () {
  xhrConfigure("GET",'/getNotificationCandidates',function () {
    if (this.readyState != 4)
      return;
    if (this.status != 200)
      return;
    newCandidates = JSON.parse(this.responseText);
    renderCandidates();
  }
  );
})();

(function() {
  xhrConfigure("GET","/getNextInterviews",function(){
    if (this.readyState != 4)
      return;
    if (this.status != 200)
      return;
    nextInterviews=JSON.parse(this.responseText);
    renderInterviews(0,nextInterviews.length);
  });
})();
