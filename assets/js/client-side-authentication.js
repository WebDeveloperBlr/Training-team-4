var logForm=document.getElementById("login-form");
logForm.onsubmit=function(event){
    event.preventDefault();
    var loginObj= {
        userLogin:this.elements.loginInput.value,
        userPassword:this.elements.passwordInput.value
    };
    var xhr=new XMLHttpRequest();
    xhr.open("POST","/authentication",true);
    xhr.setRequestHeader("Content-type",'application/json; charset=utf-8');
    xhr.send(JSON.stringify(loginObj));
    xhr.onreadystatechange=function(){
        if(this.readyState!=4)
            return;
        if(this.status!=200)
            return;
        if(this.responseText=="false"){
            var incorrPasswPopup=document.getElementById("incorrect-password-popup");
            incorrPasswPopup.classList.remove("d-none");
            return;
        }
      logForm.elements.loginInput.value="";
      logForm.elements.passwordInput.value="";
      window.location.href="/HR-app";

    };

};