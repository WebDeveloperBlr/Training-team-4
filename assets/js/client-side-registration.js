function showError() {
  submitBtn.classList.add("d-none");
  alertMes.classList.remove("d-none");
  alertMes.classList.remove("opacity-0");
  form.classList.add("less-padding");
}
var arrow=document.getElementById("decor");
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
      regCount=0;
      showError();
    }
  }
};

loginInp.oninput=function(){
  var loginInpXhr=new XMLHttpRequest();
  var infoObj={};
  var logTip=document.getElementById("login-tip");
  if(loginInp.value.length==0){
    logTip.classList.remove("login-free");
    logTip.classList.remove("login-used");
    logTip.innerHTML="Please, enter your login";
    arrow.classList.remove("login-used");
    arrow.classList.remove("login-free");
    return;
  }
  infoObj.currentLogin=loginInp.value;
  loginInpXhr.open("POST","/oninputLoginReg",true);
  loginInpXhr.setRequestHeader("Content-type", 'application/json; charset=utf-8');
  loginInpXhr.send(JSON.stringify(infoObj));
  loginInpXhr.onreadystatechange = function () {
    if (loginInpXhr.readyState != 4)
      return;
    if (loginInpXhr.status != 200)
      return;
    if (loginInpXhr.responseText=="taken" ) {
      logTip.innerHTML="This login is already used";
      logTip.classList.remove("login-free");
      logTip.classList.add("login-used");
      arrow.classList.add("login-used");
      arrow.classList.remove("login-free");
    }
    if (loginInpXhr.responseText=="free" ) {
      logTip.innerHTML="This login is free";
      logTip.classList.remove("login-used");
      logTip.classList.add("login-free");
      arrow.classList.add("login-free");
      arrow.classList.remove("login-used");
    }
  }
};



