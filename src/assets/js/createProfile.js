$(document).ready(function () {

  //this object is our create profile page -- all behavior described there
  function ProfileBuilder(elem) {

    //initialize DOM elements which we will working with
    this.photoContainer = elem;
    this.photoInput = document.getElementById('photo');
    this.previewBlock = $(this.photoContainer).find('#profilePreview');
    this.previewText = $(this.photoContainer).find('#createProfile__filename-preview');

    //all events are handled in bind event function
    this.bindEvents();
  }


  ProfileBuilder.prototype.bindEvents = function () {
    //this is a closure to main object, because "this" will be changed in events and we need access to main object
    var self = this;

    if (this.photoInput) {
      $(this.photoInput).change(function (event) {
        event.preventDefault();
        //this is how closure is working
        self.addPreview(event);
      });
    }
  };

  ProfileBuilder.prototype.addPreview = function (evt) {
    if ($(this.photoInput).length > 0) {
      $(this.previewBlock).attr('src', window.URL.createObjectURL(this.photoInput.files[0]));
      $(this.previewText).html(this.photoInput.files[0].name);
    }
  };


  // if page -- Create profile - -  initialize object
  var createProfileWrapper = $(document).find(".createProfile__edit-block");
  if (createProfileWrapper.length > 0) {
    new ProfileBuilder(createProfileWrapper);
  }
});