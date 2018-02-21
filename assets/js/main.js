
var element = document.getElementById('photo');
var previewElement = document.getElementById('profilePreview');
var previewText = document.getElementById('createProfile__filename-preview');
if (element) {
	  element.addEventListener('change',function (evt) {
		if(this.files.length>0){
			previewElement.src = window.URL.createObjectURL(this.files[0]);
	    previewText.innerText = this.files[0].name;
		}
  });
}

