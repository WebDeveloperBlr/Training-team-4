function showError() {
  submitBtn.classList.add("d-none");
  alertMes.classList.remove("d-none");
  alertMes.classList.remove("opacity-0");
  form.classList.add("less-padding");
}

var popups = document.getElementsByClassName("login-form__text");
var loginInp = document.getElementById("userLogin");
var passwordInp = document.getElementById("userPassword");
var paswordRepInp = document.getElementById("userRepPassword");
var regInfo = {};
var form = document.getElementById("login-form");

var regCount = 0;

form.onsubmit = function (event) {
  event.preventDefault();
  if (regCount) {
    return;
  }
  regCount++;
  if (loginInp.value.search(/\W/) != (-1)) {
    popups[0].innerHTML = "Login should contain only numbers, letters or underline sign";
    loginInp.classList.add("incorrect-field-value");
    loginInp.focus();
    return;
  }
  if (passwordInp.value != paswordRepInp.value) {
    popups[2].innerHTML = "Please, repeat your password correctly";
    paswordRepInp.classList.add("incorrect-field-value");
    paswordRepInp.focus();
    return;
  }
  regInfo.login = loginInp.value;
  regInfo.password = passwordInp.value;
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/registration", true);
  xhr.setRequestHeader("Content-type", 'application/json; charset=utf-8');
  xhr.send(JSON.stringify(regInfo));
  xhr.onreadystatechange = function () {
    if (xhr.readyState != 4)
      return;
    if (xhr.status != 200)
      return;
    if (xhr.responseText == "true") {
      window.location.href = "/HR-app";
    }
    if (xhr.responseText == "false") {
      alert("this login is taken");
      regCount=0;
      showError();
    }
  }
};