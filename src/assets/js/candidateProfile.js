function CustomDropdown(dropDown) {
  this.dropDown = dropDown;
  this.dropDownLink = $(this.dropDown).find('.hr-app__filters-bar__dropdown-item-link');
  this.activeItem = $(this.dropDown).find('.hr-app__filters-bar__dropdown-active-value');
  var self = this;
  this.bindEvents = function () {
    this.dropDownLink.on('click', function () {
      $(self.activeItem).find('span').text($(this).text());
      return false;
    });
  };
  this.bindEvents();
}

function Person(element, id) {
  this.data = [];
  this.id = id;
  this.URL = '/candidates/' + id;
  this.section = element;
  var self = this;
  this.nameField = $(this.section).find('#candidate-name');
  this.positionField = $(this.section).find('#candidate-position');
  this.salaryField = $(this.section).find('#candidate-salary');
  this.telephoneField = $(this.section).find('#telephoneField');
  this.emailField = $(this.section).find('#emailField');
  this.addressField = $(this.section).find('#addressField');
  this.statusField = $(this.section).find('#statusField');
  this.breadcrumbField = $(this.section).find('#breadcrumbField');
  this.nameInput = $(this.section).find('#nameInput');
  this.positionInput = $(this.section).find('#positionInput');
  this.salaryInput = $(this.section).find('#salaryInput');
  this.addressInput = $(this.section).find('#addressInput');
  this.telephoneInput = $(this.section).find('#telephoneInput');
  this.emailInput = $(this.section).find('#emailInput');
  this.statusInput = $(this.section).find('#statusInput');
  this.statusInputActiveValue = $(this.statusInput).find('.hr-app__filters-bar__dropdown-active-value span');
  this.rowsWrapper = $(this.section).find('.cands-exp__rows-wrapper');
  this.skillsWrapper = $(this.section).find('.skills__elements');
  this.editButton = $(this.section).find("#cands-editing-button");
  this.saveButton = $(this.section).find("#cands-save-button");
  this.successButton = $(this.section).find('.success-button-wrap');
  this.errorButton = $(this.section).find('#cands-error-button');
  this.reviewButton = $(this.section).find('#reviewButton');
  this.modalStatus = $(this.section).find('#addSkillModal');
  this.modalItemsWrapper = $(this.modalStatus).find('.skills-modal__items-wrapper');
  this.addSkillButton = $(this.section).find('#addSkillButton');
  this.addExpButton = $(this.section).find('#addExpButton');
  this.modalExpWrapper = $(this.section).find('.exp-modal__body-inner-wrap');
  this.modalSaveExpButton = $(this.section).find('#modalSaveExpButton');
  this.modalPositionInput = $(this.modalExpWrapper).find('#exp-modal__row__left-col__exp-position-input');
  this.modalDateFromInput = $(this.modalExpWrapper).find('[data-attr="from"]');
  this.modalDateToInput = $(this.modalExpWrapper).find('[data-attr="to"]');
  this.modalCompanyInput = $(this.modalExpWrapper).find('#exp-modal__row__right-col__company-input');
  this.modalInfoInput = $(this.modalExpWrapper).find('#exp-modal__row__right-col__description-textarea');


  this.clearPerson = function () {
    $(this.editButton).removeClass('d-none');
    $(this.saveButton).addClass('d-none');
    this.hideInputs();
    this.unbindAll();
  };

  this.unbindAll = function () {
    $(this.saveButton).unbind();
    $(this.editButton).unbind();
    $(this.modalSaveExpButton).unbind();
  };

  this.getData = function (res) {
    $.get(self.URL, {json: "true"}, function (data) {
      self.data = data;
      res();
    });
  };

  this.saveData = function () {
    self.data.docs[0].name = $(this.nameInput).val();
    self.data.docs[0].position = $(this.positionInput).val();
    self.data.docs[0].salary = $(this.salaryInput).val();
    self.data.docs[0].telephone = $(this.telephoneInput).val();
    self.data.docs[0].email = $(this.emailInput).val();
    self.data.docs[0].address = $(this.addressInput).val();
    self.data.docs[0].status = $(this.statusInput).find('.hr-app__filters-bar__dropdown-active-value').text();
    var splitName = self.data.docs[0].name.split(" ");
    self.data.docs[0].firstName = splitName[0];
    self.data.docs[0].lastName = splitName[1];
    this.getSkills();
    this.getExp();
  };

  this.getExp = function () {
    self.data.newExp = [];
    self.data.oldExp = [];

    var exp = {};
    var hasExp = true;
    var count=0;
    $(self.expItems).each(function (ind, el) {
      var elFromValue = reverseDate($(el).find('[data-attr="from"]').val());
      var elToValue = reverseDate($(el).find('[data-attr="to"]').val());
      var elPositionValue = $(el).find('[data-attr="expPositionInput"]').val();
      var elInfoValue = $(el).find('[data-attr="expInfoInput"]').val();
      var elCompanyValue = $(el).find('[data-attr="expCompanyInput"]').val();
      exp = {
        dateStart: elFromValue,
        dateEnd: elToValue,
        position: elPositionValue.trim(),
        info: elInfoValue.trim(),
        company: elCompanyValue.trim()
      };
      if (typeof self.data.exp[ind]!=='undefined') {
        exp.id_experience = self.data.exp[ind].id_experience;
        self.data.exp[ind] = exp;
      }else{
        self.data.newExp.push(exp);
      }
      count = ind+1;
    });
    if(self.data.exp.length>count){
      for(var i=count;i<self.data.exp.length;i++){
        console.log(i);
        exp = {
          id_experience: self.data.exp[i].id_experience
        };
        self.data.oldExp.push(exp);
      }
    }
    console.log("Debug");
    console.log(self.data);
  };

  this.getSkills = function () {
    self.data.newSkills = [];
    self.data.oldSkills = [];
    $(self.skillsWrapper).find('.skills__elements__decoration').each(function (index, el) {
      var hasSkill = false;
      self.data.skills.forEach(function (item) {
        if ($(el).text() === item.name) {
          hasSkill = true;
        }
      });
      if (!hasSkill) {
        self.data.newSkills.push($(el).text());
      }
    });
    self.data.skills.forEach(function (item) {
      var hasSkill = false;
      $(self.skillsWrapper).find('.skills__elements__decoration').each(function (index, el) {
        if ($(el).text() === item.name) {
          hasSkill = true;
        }
      });
      if (!hasSkill) {
        self.data.oldSkills.push(item.name);
      }
    });

  };

  this.hideInputs = function () {

    for (var i = 0; i < self.allInputs.length; i++) {
      $(self.allInputs[i]).addClass('d-none');
      $(self.allInputs[i]).removeClass('border-danger');
      $(self.allInputs[i]).val("");
    }
    for (i = 0; i < self.allTextareas.length; i++) {
      $(self.allTextareas[i]).addClass('d-none');
      $(self.allTextareas[i]).removeClass('border-danger');
      $(self.allTextareas[i]).val("");
    }
    $(self.candFields).each(function (ind, el) {
      $(el).removeClass('d-none');
    });
    $(self.dateInputs).each(function (ind, el) {
      $(el).addClass('d-none');
    });
    $(self.expItems).each(function (ind, el) {
      $(el).find('.cands-exp__right-part-item__delete-button').addClass('d-none');
    });
    $(".cands-exp__editing-button").removeClass("d-none");
    $(self.reviewButton).removeClass('d-none');
    $('.candidate-profile__candidate-label').addClass('d-none');
    $(self.addSkillButton).addClass('d-none');
    $(self.addExpButton).addClass('d-none');
  };

  this.showInputs = function () {
    for (var i = 0; i < self.allInputs.length; i++) {
      $(self.allInputs[i]).removeClass('d-none');
      $(self.allInputs[i]).val($(self.allInputs[i]).prev().text());
    }
    $(self.statusInputActiveValue).text($(self.statusField).text());
    for (i = 0; i < self.allTextareas.length; i++) {
      $(self.allTextareas[i]).removeClass('d-none');
      $(self.allTextareas[i]).val($(self.allTextareas[i]).prev().text());
    }
    $(self.dateLabels).removeClass('d-none');
    $(self.candFields).each(function (ind, el) {
      $(el).addClass('d-none');
    });
    $(self.expItems).each(function (ind, el) {
      $(el).find('.cands-exp__right-part-item__delete-button').removeClass('d-none');
      var fromInput = $(el).find('[data-attr="from"]');
      var toInput = $(el).find('[data-attr="to"]');
      if ($(fromInput).length > 0) {
        $(fromInput).removeClass('d-none');
        $(fromInput).jqxDateTimeInput('val', sqlToJsDate(self.data.exp[ind].dateStart, ","));
      }
      if ($(toInput).length > 0) {
        $(toInput).removeClass('d-none');
        if (!self.data.exp[ind].dateEnd) {
          $(toInput).jqxDateTimeInput('val', null);
        } else {
          $(toInput).jqxDateTimeInput('val', sqlToJsDate(self.data.exp[ind].dateEnd, ","));
        }
      }
    });
    $(self.reviewButton).addClass('d-none');
    $('.candidate-profile__candidate-label').removeClass('d-none');
    $(self.addSkillButton).removeClass('d-none');
    $(self.addExpButton).removeClass('d-none');
  };

  this.postDataToServer = function () {
    $.ajax({
      url: self.URL,
      data: self.data,
      method: "PUT"
    }).done(function () {
      self.clearPerson();
      new Person(self.section, self.id);
      /*self.data.newSkills.forEach(function (item) {
        self.data.skills.push({name: item});
      });*/
      $(self.successButton).addClass('animate--bounce');
      setTimeout(function () {
        $(self.editButton).removeClass('d-none');
        $(self.successButton).removeClass('animate--bounce');
      }, 1000);

      console.log("Person is going to be updated!");
    }).fail(function () {
      console.log("Something going wrong with putting data to server!");
    });
  };
  this.validate = function () {
    var f1 = true;
    if (!$(this.nameInput).val().match(/[a-zA-Z]{2,}\s+[a-zA-Z]{2,}/)) {
      $(this.nameInput).addClass('border-danger');
      f1 = false;
    } else {
      $(this.nameInput).removeClass('border-danger');
    }
    if (!$(this.salaryInput).val().match(/[0-9]{2,}\$/)) {
      $(this.salaryInput).addClass('border-danger');
      f1 = false;
    } else {
      $(this.salaryInput).removeClass('border-danger');
    }
    if (!$(this.telephoneInput).val().match(/\+[0-9]{5,}/)) {
      $(this.telephoneInput).addClass('border-danger');
      f1 = false;
    } else {
      $(this.telephoneInput).removeClass('border-danger');
    }
    if (!$(this.emailInput).val().match(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
      $(this.emailInput).addClass('border-danger');
      f1 = false;
    } else {
      $(this.emailInput).removeClass('border-danger');
    }
    if (!contains(this.data.allStatuses, this.statusInputActiveValue.text())) {
      $(this.statusInput).addClass('border-danger');
      f1 = false;
    } else {
      $(this.statusInput).removeClass('border-danger');
    }
    if (!this.positionInput.jqxComboBox('getSelectedItem')) {
      $(this.positionInput).addClass('border-danger');
      f1 = false;
    } else {
      $(this.statusInput).removeClass('border-danger');
    }
    if(!self.validateExp()){
      f1 = false;
    }
    return f1;
  };

  this.validateExp = function () {
    var fromInp;
    var companyName;
    var position;
    var info;
    var f1 = true;
    $(self.expItems).each(function (ind, el) {
      fromInp = $(el).find('[data-attr="from"]');
      companyName = $(el).find('[data-attr="expCompanyInput"]');
      position = $(el).find('[data-attr="expPositionInput"]');
      info = $(el).find('[data-attr="expInfoInput"]');
      if($(fromInp).val().trim()===""){
        $(fromInp).addClass('border-danger');
        f1 = false;
      }
      if($(companyName).val().trim()===""){
        $(companyName).addClass('border-danger');
        f1 = false;
      }
      if($(position).val().trim()===""){
        $(position).addClass('border-danger');
        f1 = false;
      }
      if($(info).val().trim()===""){
        $(info).addClass('border-danger');
        f1 = false;
      }
    });
    return f1;
  };

  this.bindEvents = function () {
    $(this.saveButton).on('click', function (e) {
      e.preventDefault();
      if (self.validate()) {
        self.saveData();
        console.log(self.data);
        self.postDataToServer();
      } else {
        $(self.saveButton).addClass('d-none');
        $(self.errorButton).addClass('animate--bounce');
        setTimeout(function () {
          $(self.errorButton).removeClass('animate--bounce');
          $(self.saveButton).removeClass('d-none');
        }, 1000);
        console.log("please, check the data!");
      }
      return false;
    });
    $(this.editButton).click(function () {
      self.bindSkillDelete();
      self.showInputs();
      $(this).addClass('d-none');
      $(self.saveButton).removeClass('d-none');
      return false;
    });

    $(this.modalSaveExpButton).on('click', function () {
      var values = [$(self.modalDateFromInput).val(),
        $(self.modalDateToInput).val(),
        $(self.modalPositionInput).val(),
        $(self.modalCompanyInput).val(),
        $(self.modalInfoInput).val()];

      self.addExperienceInputsRow(values);
      var fromInput;
      var toInput;
      self.expItems = $(self.section).find('.cands-exp__row');
      $('.cands-exp').find('[data-attr="newInputsRow"]').each(function (ind, el) {
        fromInput=$(el).find('[data-attr="from"]');
        $(fromInput).jqxDateTimeInput({width: '150px', height: '25px'});
        $(fromInput).jqxDateTimeInput('val', $(fromInput).attr('data-val'));
        toInput=$(el).find('[data-attr="to"]');
        $(toInput).jqxDateTimeInput({width: '150px', height: '25px'});
        $(toInput).jqxDateTimeInput('val', $(toInput).attr('data-val'));
      });
      self.bindExpDelete();
    })
  };

  this.addExperienceInputsRow = function (values) {
    var row;
    row = '<div class="cands-exp__row" data-attr="newInputsRow">\n' +
      '                  <div class="cands-exp__row-left-part">\n' +
      '                    <div class="cands-exp__left-part-item">\n' +
      '                      <div class="cands-exp__left-part-date">\n' +
      '                        <div class="exp-description d-none" data-attr = "to-be-hidden"></div>' +
      '                      </div>' +
      '                      <div class="exp-description cands-exp__left-part-description d-none" data-attr = "to-be-hidden"></div><input type="text" value="' + values[2] + '" class="txt candidate-profile__exp-position-input" data-attr="expPositionInput"/>' +
      '<div class="candidate-profile__date-inputs-wrapper"><label class="candidate-profile__date-label" data-attr="date-label">From</label><div class="candidate-profile__dateInput" data-val="' + values[0] +
      '" data-attr="from"></div></div>' +
      '<div class="candidate-profile__date-inputs-wrapper"><label class="candidate-profile__date-label" data-attr="date-label">To</label><div class="candidate-profile__dateInput" data-val="' + values[1] +
      '" data-attr="to"></div></div>' +
      '                    </div>' +
      '                  </div>' +
      '                  <div class="cands-exp__row-right-part">' +
      '                    <div class="cands-exp__right-part-item">' +
      '                      <div class="cands-exp__right-part-item__delete-button"><svg class="icon icon-bin ">\n' +
      '              <use xlink:href="assets/images/svg/symbol/sprite.svg#bin"></use>\n' +
      '            </svg></div><div class="cands-exp__right-part-item-header d-none" data-attr = "to-be-hidden"></div><input class="txt cands-exp__right-part-item-companyInput" data-attr="expCompanyInput" value="' + values[3] + '" type="text"/>' +
      '                      <div class="exp-description cands-exp__right-part-item-description d-none" data-attr = "to-be-hidden"></div>' +
      '                      <textarea rows="3" data-attr="expInfoInput" class="txt cands-exp__right-part-item-description-textarea" value="">' + values[4] + '</textarea>' +
      '                    </div>\n' +
      '                  </div>\n' +
      '                </div>';
    $(self.rowsWrapper).append(row);
  };

  this.addExperienceRow = function (values) {
    var row;
    row = '<div class="cands-exp__row">\n' +
      '                  <div class="cands-exp__row-left-part">\n' +
      '                    <div class="cands-exp__left-part-item">\n' +
      '                      <div class="cands-exp__left-part-date">\n' +
      '                        <div class="exp-description" data-attr = "to-be-hidden">' +
      values[0] +
      '                        </div>' +
      '                      </div>' +
      '                      <div class="exp-description cands-exp__left-part-description " data-attr = "to-be-hidden">' +
      values[1] +
      '                      </div><input type="text" class="txt candidate-profile__exp-position-input d-none" data-attr="expPositionInput"/>' +
      '<div class="candidate-profile__date-inputs-wrapper"><label class="d-none candidate-profile__date-label" data-attr="date-label">From</label><div class="candidate-profile__dateInput d-none" data-attr="from"></div></div>' +
      '<div class="candidate-profile__date-inputs-wrapper"><label class="d-none candidate-profile__date-label" data-attr="date-label">To</label><div class="candidate-profile__dateInput d-none" data-attr="to"></div></div>' +
      '                    </div>' +
      '                  </div>' +
      '                  <div class="cands-exp__row-right-part">' +
      '                    <div class="cands-exp__right-part-item">' +
      '                      <div class="d-none cands-exp__right-part-item__delete-button"><svg class="icon icon-bin ">\n' +
      '              <use xlink:href="assets/images/svg/symbol/sprite.svg#bin"></use>\n' +
      '            </svg></div><div class="cands-exp__right-part-item-header" data-attr = "to-be-hidden">' +
      values[2] +
      '                      </div><input class="txt cands-exp__right-part-item-companyInput d-none" data-attr="expCompanyInput" type="text"/>' +
      '                      <div class="exp-description cands-exp__right-part-item-description " data-attr = "to-be-hidden">' +
      values[3] +
      '                      </div>' +
      '                      <textarea rows="3" data-attr="expInfoInput" class="txt cands-exp__right-part-item-description-textarea d-none">                        </textarea>' +
      '                    </div>\n' +
      '                  </div>\n' +
      '                </div>';
    $(self.rowsWrapper).append(row);
  };

  this.fillExperience = function () {
    var values;
    $(self.rowsWrapper).html("");
    this.data.exp.forEach(function (el) {
      values = [sqlToJsDate(el.dateStart) + ' - ' + sqlToJsDate(el.dateEnd), el.position, el.company, el.info];
      self.addExperienceRow(values);
    });
    self.bindExpDelete();
  };

  this.fillDropdown = function () {
    var rows = '';
    self.data.allStatuses.forEach(function (elem) {
      rows += '<li class="hr-app__filters-bar__dropdown-list-item"><a class="hr-app__filters-bar__dropdown-item-link">' + elem.name + '</a></li>';
    });
    $(self.statusInput).find('.hr-app__filters-bar__dropdown-list').html("");
    $(self.statusInput).find('.hr-app__filters-bar__dropdown-list').append(rows);
  };
  this.fillSkills = function () {
    var row = '';
    this.data.skills.forEach(function (el) {
      row += '<span class="skills__elements__decoration">' + el.name + '</span>';
    });
    $(this.skillsWrapper).html(row);
  };
  this.fillPosition = function () {
    var row = '';
    var arr = [];
    this.data.allPositions.forEach(function (el) {
      arr.push(el.name);
    });
    self.positionInput.jqxComboBox({
      source: arr,
      selectedIndex: 0,
      width: '180px',
      height: '25px',
      itemHeight: 30,
      dropDownWidth: 180,
      dropDownHeight: '150px'
    });
  };
  this.fillFields = function () {
    $(this.positionField).html(self.data.docs[0].position);
    $(this.nameField).html(self.data.docs[0].name);
    $(this.breadcrumbField).html(self.data.docs[0].name);
    $(this.salaryField).html(self.data.docs[0].salary + "$");
    $(this.telephoneField).html(self.data.docs[0].telephone);
    $(this.emailField).html(self.data.docs[0].email);
    $(this.addressField).html(self.data.docs[0].address);
    $(this.statusField).html(self.data.docs[0].status);
    this.fillExperience();
    this.fillSkills();
  };
  this.fillAddSkill = function () {
    $(self.modalItemsWrapper).html('');
    var row;
    self.data.allSkills.forEach(function (el) {
      var hasSkill = false;
      $(self.skillsWrapper).find('.skills__elements__decoration').each(function (index, skill) {
        if (el.name === $(skill).text()) {
          hasSkill = true;
        }
      });
      if (!hasSkill) {
        row = '<div class="skills-modal__item">\n' +
          '                          <span class="skills-modal__item-text">' + el.name + '</span>\n' +
          '                        </div>';
        $(self.modalItemsWrapper).append(row);
      }
    });
  };
  this.bindSkillAdd = function () {
    var row;
    $(self.modalItemsWrapper).find('.skills-modal__item').each(function (index, el) {
      $(el).on('click', function () {
        row = '<span class="skills__elements__decoration">' + $(el).find('.skills-modal__item-text').text() + '</span>';
        $(el).remove();
        $(self.skillsWrapper).append(row);
        self.bindSkillDelete();
      })
    })
  };
  this.bindSkillDelete = function () {
    $(self.skillsWrapper).find('.skills__elements__decoration').each(function (ind, el) {
      $(el).addClass('skill--deletable');
      $(el).on('click', function () {
        $(el).remove();
        self.fillAddSkill();
        self.bindSkillAdd();
      });
    });
  };

  this.bindExpDelete = function () {
    var elems = $(self.section).find('.cands-exp__right-part-item__delete-button');
    $(elems).each(function (ind, elem) {
      $(elem).on('click', function () {
        $(elem).closest('.cands-exp__row').remove();
        self.expItems = $(self.section).find('.cands-exp__row');
      });
    });
  };

  var gettingData = new Promise(function (res, rej) {
    self.getData(res);
  });
  if ($(this.modalExpWrapper).length > 0) {
    $(this.modalExpWrapper).find('[data-attr="from"]').jqxDateTimeInput({width: '150px', height: '25px'});
    $(this.modalExpWrapper).find('[data-attr="to"]').jqxDateTimeInput({width: '150px', height: '25px'});
  }
  gettingData.then(function () {
    console.log("Got data!");
    console.log(self.data);
    self.fillFields();
    self.fillDropdown();
    self.fillPosition();
    self.fillAddSkill();
    self.bindSkillAdd();
    new CustomDropdown(self.statusInput);

  }).then(function () {
    self.dateInputs = $(self.section).find('.candidate-profile__dateInput');
    if ($(self.dateInputs).length > 0) {
      $(self.dateInputs).jqxDateTimeInput({width: '150px', height: '25px'});
    }
    self.allTextareas = $(self.section).find('.txt');
    self.allInputs = $(self.section).find('.inp');
    self.descriptions = $(self.section).find(".exp-description");
    self.candFields = $(self.section).find('[data-attr = "to-be-hidden"]');
    self.dateLabels = $(self.section).find('[data-attr="date-label"]');
    self.dateInputs = $(self.section).find('.candidate-profile__dateInput');
    self.expItems = $(self.section).find('.cands-exp__row');
  });

  this.bindEvents();

}

function contains(arr, val) {
  var f1 = false;
  arr.forEach(function (item) {
    for (var key in item) {
      if (item[key] === val) {
        f1 = true;
        return f1;
      }
    }
  });
  return f1;
}

function sqlToJsDate(sqlDate, separator) {
  if (sqlDate) {
    //sqlDate in SQL DATETIME format ("yyyy-mm-dd hh:mm:ss.ms")
    var sqlDateWithoutTime = sqlDate.substring(0, sqlDate.indexOf("T"));
    var sqlDateArr1 = sqlDateWithoutTime.split("-");
    //format of sqlDateArr1[] = ['yyyy','mm','dd hh:mm:ms']
    var sYear = sqlDateArr1[0];
    var sMonth = sqlDateArr1[1];
    var sDay = sqlDateArr1[2];
    //format of sqlDateArr2[] = ['dd', 'hh:mm:ss.ms']
    if (separator) {
      return sYear + separator + sMonth + separator + sDay;
    } else {
      return sYear + '.' + sMonth + '.' + sDay;
    }
  } else return "Now"

}

function reverseDate(date) {
  if (date) {
    var arr = date.split("/");
    return arr[2] + "/" + arr[1] + "/" + arr[0];
  } else {
    return null;
  }
}