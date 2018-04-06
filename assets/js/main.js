$(document).ready(function () {

  function HrAppBuilder(elem, activeSection) {
    var self = this;
    this.section = elem;
    this.sidebar = $(this.section).find('.hr-app-section__sidebar');
    this.tabLinks = $(this.section).find('[data-attr="tab-link"]');
    this.vacanciesSection = $(this.section.find('#vacancies-tab'));
    this.candidatesSection = $(this.section.find('#candidates-tab'));
    this.candidateProfile = $(this.section.find('#candidate-profile-block'));
    this.toggleButton = $(this.section).find('.icon-HAMBURGER');
    this.crossButton = $(this.sidebar).find('.icon-CLOSE');

    this.initialize = function () {
      if (self.vacanciesSection.hasClass('active')) {
        self.application = new Vacancies(self.vacanciesSection);
      } else {
        self.vacanciesSection.addClass('d-none');
      }
      if ($(self.candidatesSection).hasClass('active')) {
        self.application = new Candidates(self.candidatesSection);
      } else {
        self.candidatesSection.addClass('d-none');
      }
      if ($(self.candidateProfile).hasClass('active')) {
        self.application = new Person(self.candidateProfile, activeSection.id);
      } else {
        self.candidateProfile.addClass('d-none');
      }
    };
    this.showSidebar = function () {
      $(this.sidebar).addClass('slide-in');
    };
    this.hideSidebar = function () {
      $(this.sidebar).removeClass('slide-in');
    };
    this.disableTabs = function () {
      self.tabLinks.removeClass("active");
      self.candidateProfile.addClass("d-none").removeClass("active");
      self.clear();
      $(self.tabLinks).each(function (index, elem) {
        $($(elem).attr('data-target')).removeClass("active").addClass("d-none");
      });
    };
    this.clear = function () {
      $(this.section).find('.table--row').each(function (index, el) {
        $(el).remove();
      });
    };
    this.bindEvents = function () {
      $(self.tabLinks).on('click', function () {
        if(typeof self.application!=='undefined'&&typeof self.application.clearPerson!=='undefined'){
          self.application.clearPerson();
        }
        self.disableTabs();
        $($(this).attr('data-target')).removeClass("d-none").addClass("active");
        self.initialize();
        return false;
      });
      $(this.toggleButton).on('click', function () {
        self.showSidebar();
      });
      $(this.crossButton).on('click', function () {
        self.hideSidebar();
      });
    };

    this.disableTabs();
    if (activeSection && $(activeSection.section).length > 0) {
      $(activeSection.section).removeClass('d-none');
      $(activeSection.section).addClass('active');
    }
    this.initialize();
    this.bindEvents();
  }

  function Section(element, tableName, filterBarId) {
    this.section = element;
    this.filterBar = this.section.find(filterBarId);
    this.table = $(this.section).find(tableName);
    this.itemsCountSelect = $(this.table).find('#rows-per-page-vacancies');
    this.pagination = $(this.section).find('#pagination');
    this.itemsPerPage = +($(this.section).find("#rows-per-page-vacancies option:selected").text());
    this.itemsInformation = $(this.table).find('.hr-app__table-editor__pagination');
    this.filterItems = $(this.filterBar).find('[data-attr="filter-item"]');
    this.data = [];
    this.filterObj = [];
    this.defaultOptions = {};
  }

  Object.setPrototypeOf(Candidates.prototype, Section.prototype);

  function Candidates(element) {
    var self = this;
    Section.call(this, element, "#hr-app__table", "#candidates-filters-bar");
    this.InitializeFilterObj();
    this.URL = "/candidates";
    this.filterItems = $(this.filterBar).find('[data-attr="filter-item"]');
    this.tableFields = {
      Photo: "",
      Name: "name",
      Position: "position",
      Status: "status",
      "View Candidate": "id_candidate"
    };
    this.getData = function () {
      var gettingData = new Promise(function (resolve, reject) {
        self.getDataFromServer(resolve);
      });
      gettingData.then(function () {
        self.bindLinksHandler();
      });
    };
    this.getData();

    this.bindLinksHandler = function () {
      var self = this;
      var links = $(this.section).find('[data-attr="tab-link"]');
      links.on('click', function (e) {
        e.preventDefault();
        new HrAppBuilder($(document).find(".hr-app-section"), {
          section: $(document).find("#candidate-profile-block"),
          id: $(this).attr('data-link')
        });
      });
    };

    if (window.matchMedia('(max-width: 515px)').matches) {
      $('.hr-app__table-editor__text').html('Rows');
      this.canSlide = true;
      this.collapseElems = $(this.section).find('[data-toggle="collapse"]');
      this.addCollapse();
      this.bindMobileEvents();
    } else {
      this.bindEvents();
    }
  }

  Object.setPrototypeOf(Vacancies.prototype, Section.prototype);

  function Vacancies(element) {
    Section.call(this, element, "#hr-app__table", "#vacancies-filters-bar");
    this.InitializeFilterObj();
    this.URL = "/vacancies";
    var self = this;
    this.getData = function () {
      var gettingData = new Promise(function (resolve, reject) {
        self.getDataFromServer(resolve);
      });
      gettingData.then(function () {
      });
    };
    this.getData();
    this.tableFields = {
      Position: "position",
      Requirements: "requirements",
      "Work Experience": "workExperienceName",
      "View Candidates": "id_vacancy"
    };
    if (window.matchMedia('(max-width: 515px)').matches) {
      //this is for sliding filter-panel
      $('.hr-app__table-editor__text').html('Rows');
      this.canSlide = true;
      this.collapseElems = $(this.section).find('[data-toggle="collapse"]');
      this.addCollapse();
      this.bindMobileEvents();
    } else {
      //not mobile events
      this.bindEvents();
    }
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

    this.clearPerson = function () {
      $(this.editButton).removeClass('d-none');
      $(this.saveButton).addClass('d-none');
      this.hideInputs();
      this.unbindAll();
    };

    this.unbindAll = function () {
      $(this.saveButton).unbind();
      $(this.editButton).unbind();
    };

    this.getData = function (res) {
      $.get(self.URL, {json: "true"}, function (data) {
        self.data = data;
        res();
      });
    };

    this.saveData = function () {
      $(this.nameField).text($(this.nameInput).val());
      $(this.positionField).text($(this.positionInput).val());
      $(this.salaryField).text($(this.salaryInput).val());
      $(this.telephoneField).text($(this.telephoneInput).val());
      $(this.emailField).text($(this.emailInput).val());
      $(this.addressField).text($(this.addressInput).val());
      $(this.statusField).html($(this.statusInput).find('.hr-app__filters-bar__dropdown-active-value').text());
    };

    this.getSkills = function () {
      self.data.newSkills = [];
      self.data.oldSkills = [];
      $(self.skillsWrapper).find('.skills__elements__decoration').each(function (index, el) {
        var hasSkill=false;
        self.data.skills.forEach(function (item) {
          if($(el).text()===item.name){
            hasSkill=true;
          }
        });
        if(!hasSkill){
          self.data.newSkills.push($(el).text());
        }
      });
      self.data.skills.forEach(function (item) {
        var hasSkill=false;
        $(self.skillsWrapper).find('.skills__elements__decoration').each(function (index, el) {
          if($(el).text()===item.name){
            hasSkill=true;
          }
        });
        if(!hasSkill){
          self.data.oldSkills.push(item.name);
        }
      });

    };
    this.getDataFromFields = function () {
      self.data.docs[0].position = $(this.positionField).text();
      self.data.docs[0].name = $(this.nameField).text();
      self.data.docs[0].telephone = $(this.telephoneField).text();
      self.data.docs[0].email = $(this.emailField).text();
      self.data.docs[0].address = $(this.addressField).text();
      self.data.docs[0].status = $(this.statusInputActiveValue).text();
      self.data.docs[0].salary = $(this.salaryField).html().slice(0,$(this.salaryField).html().indexOf('$'));
      var trimName = self.data.docs[0].name.split(" ");
      self.data.docs[0].firstName = trimName[0];
      self.data.docs[0].lastName = trimName[1];
      //this.getExperience();
      this.getSkills();
    };
    this.hideInputs = function () {

      for (var i = 0; i < self.allInputs.length; i++) {
        $(self.allInputs[i]).addClass('d-none');
        $(self.allInputs[i]).removeClass('border-danger');
        $(self.allInputs[i]).val("");
      }
      for (i = 0; i < self.allTextareas.length; i++) {
        $(self.allTextareas[i]).addClass('d-none');
        $(self.allTextareas[i]).addClass('border-danger');
        $(self.allTextareas[i]).val("");
      }
      $(self.candFields).each(function (ind, el) {
        $(el).removeClass('d-none');
      });
      $(".cands-exp__editing-button").removeClass("d-none");
      $(self.reviewButton).removeClass('d-none');
      $('.candidate-profile__candidate-label').addClass('d-none');
      $(self.addSkillButton).addClass('d-none');
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
      $(self.candFields).each(function (ind, el) {
        $(el).addClass('d-none');
      });
      $(self.reviewButton).addClass('d-none');
      $('.candidate-profile__candidate-label').removeClass('d-none');
      $(self.addSkillButton).removeClass('d-none');
    };
    this.fillExperience = function () {
      var row = '';
      this.data.exp.forEach(function (el) {
        row += '<div class="cands-exp__row">\n' +
          '                  <div class="cands-exp__row-left-part">\n' +
          '                    <div class="cands-exp__left-part-item">\n' +
          '                      <div class="cands-exp__left-part-date">\n' +
          '                        <div class="exp-description" data-attr = "to-be-hidden">' +
          sqlToJsDate(el.dateStart) + ' - ' + sqlToJsDate(el.dateEnd) +
          '                        </div>' +
          '                        <textarea rows="2" data-attr="expFieldInput" class="txt cands-exp__right-part-item-description-textarea cands-exp__textarea-lfet-part-fix d-none"></textarea>' +
          '                      </div>' +
          '                      <div class="exp-description cands-exp__left-part-description " data-attr = "to-be-hidden">' +
          el.position +
          '                      </div>' +
          '                      <textarea rows="2" class="txt cands-exp__right-part-item-description-textarea' +
          '                    cands-exp__textarea-lfet-part-fix d-none"></textarea>' +
          '                    </div>' +
          '                  </div>' +
          '                  <div class="cands-exp__row-right-part">' +
          '                    <div class="cands-exp__right-part-item">' +
          '                      <div class="cands-exp__right-part-item-header" data-attr = "to-be-hidden">' +
          el.company +
          '                      </div><input class="txt cands-exp__right-part-item-description-textarea d-none" type="text"/>' +
          '                      <div class="exp-description cands-exp__right-part-item-description " data-attr = "to-be-hidden">' +
          el.info +
          '                      </div>' +
          '                      <textarea rows="3" class="txt cands-exp__right-part-item-description-textarea d-none">                        </textarea>' +
          '                    </div>\n' +
          '                  </div>\n' +
          '                </div>';
      });
      $(this.rowsWrapper).html(row);
    };
    this.postDataToServer = function () {
      $.ajax({
        url: self.URL,
        data: self.data,
        method: "PUT"
      }).done(function () {
        self.data.newSkills.forEach(function (item) {
          self.data.skills.push({name: item});
        });
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
      if(!$(this.nameInput).val().match(/[a-zA-Z]{2,}\s+[a-zA-Z]{2,}/)){
        $(this.nameInput).addClass('border-danger');
        f1 = false;
      }else{
        $(this.nameInput).removeClass('border-danger');
      }
      if(!$(this.salaryInput).val().match(/[0-9]{2,}\$/)){
        $(this.salaryInput).addClass('border-danger');
        f1 = false;
      }else{
        $(this.salaryInput).removeClass('border-danger');
      }
      if(!$(this.telephoneInput).val().match(/\+[0-9]{5,}/)){
        $(this.telephoneInput).addClass('border-danger');
        f1 = false;
      }else{
        $(this.telephoneInput).removeClass('border-danger');
      }
      if(!$(this.emailInput).val().match(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)){
        $(this.emailInput).addClass('border-danger');
        f1 = false;
      }else{
        $(this.emailInput).removeClass('border-danger');
      }
      if(!contains(this.data.allStatuses,this.statusInputActiveValue.text())){
        $(this.statusInput).addClass('border-danger');
        f1 = false;
      }else{
        $(this.statusInput).removeClass('border-danger');
      }
      if(!this.positionInput.jqxComboBox('getSelectedItem')){
        $(this.positionInput).addClass('border-danger');
        f1 = false;
      }else{
        $(this.statusInput).removeClass('border-danger');
      }
      return f1;
    };
    this.bindEvents = function () {
      $(this.saveButton).on('click', function (e) {
        e.preventDefault();
        if(self.validate()){
          self.saveData();
          self.getDataFromFields();
          console.log(self.data);
          self.postDataToServer();
          self.hideInputs();
          $(this).addClass('d-none');
        }else{
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
    };
    this.fillDropdown = function () {
      var rows = '';
        self.data.allStatuses.forEach(function (elem) {
          rows+='<li class="hr-app__filters-bar__dropdown-list-item"><a class="hr-app__filters-bar__dropdown-item-link">'+elem.name+'</a></li>';
        });
      $(self.statusInput).find('.hr-app__filters-bar__dropdown-list').html("");
      $(self.statusInput).find('.hr-app__filters-bar__dropdown-list').append(rows);
    };
    this.fillSkills = function () {
      var row='';
      this.data.skills.forEach(function (el) {
        row+='<span class="skills__elements__decoration">'+el.name+'</span>';
      });
      $(this.skillsWrapper).html(row);
    };
    this.fillPosition = function () {
      var row='';
      var arr = [];
      this.data.allPositions.forEach(function (el) {
        arr.push(el.name);
      });
      console.log(arr);
      self.positionInput.jqxComboBox({ source: arr, selectedIndex: 0, width: '180px', height: '25px',itemHeight: 30,dropDownWidth: 180, dropDownHeight: '150px' });
    };
    this.fillFields = function () {
      $(this.positionField).html(self.data.docs[0].position);
      $(this.nameField).html(self.data.docs[0].name);
      $(this.breadcrumbField).html(self.data.docs[0].name);
      $(this.salaryField).html(self.data.docs[0].salary+"$");
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
        $(self.skillsWrapper).find('.skills__elements__decoration').each(function (index,skill) {
          if(el.name===$(skill).text()){
            hasSkill = true;
          }
        });
        if(!hasSkill){
          row='<div class="skills-modal__item">\n' +
            '                          <span class="skills-modal__item-text">'+el.name+'</span>\n' +
            '                        </div>';
          $(self.modalItemsWrapper).append(row);
        }
      });
    };
    this.bindSkillAdd = function () {
      var row;
      $(self.modalItemsWrapper).find('.skills-modal__item').each(function (index, el) {
        $(el).on('click',function () {
          row ='<span class="skills__elements__decoration">'+$(el).find('.skills-modal__item-text').text()+'</span>';
          $(el).remove();
          $(self.skillsWrapper).append(row);
          self.bindSkillDelete();
        })
      })
    };
    this.bindSkillDelete = function () {
      $(self.skillsWrapper).find('.skills__elements__decoration').each(function (ind,el) {
        $(el).addClass('skill--deletable');
        $(el).on('click',function () {
          $(el).remove();
          self.fillAddSkill();
          self.bindSkillAdd();
        });
      });
    };


    var gettingData = new Promise(function (res, rej) {
      self.getData(res);
    });

    gettingData.then(function () {
      self.fillFields();
      self.fillDropdown();
      self.fillPosition();
      self.fillAddSkill();
      self.bindSkillAdd();
      new CustomDropdown(self.statusInput);
    }).then(function () {
      self.allTextareas = $(self.section).find('.txt');
      self.allInputs = $(self.section).find('.inp');
      self.descriptions = $(self.section).find(".exp-description");
      self.candFields = $('[data-attr = "to-be-hidden"]');
    });

    this.bindEvents();

  }
  function contains(arr, val) {
    var f1 = false;
    arr.forEach(function (item) {
      for (var key in item){
        if(item[key]===val){
          f1 = true;
          return f1;
        }
      }
    });
    return f1;
  };

  Section.prototype.bindEvents = function () {
    var self = this;

    var previousScroll = 0;
    $(this.table).on('scroll', function (event) {
      var currentScroll = $(this).scrollTop();
      previousScroll = self.slideFilterBar(previousScroll, currentScroll);
    });

    $('#table--header-col--pos').on('click', self.sortTable.bind(null, 0));
    $('#table--header-col--exp').on('click', self.sortTable.bind(null, 1));
    $('#table--header-col--sal').on('click', self.sortTable.bind(null, 2));

    self.filterItems.on('input', function () {
      self.InitializeFilterObj(self.filterItems);
      self.getData(self.URL);
    });
    $(this.itemsCountSelect.on('change', function () {
      self.itemsPerPage = $(this).find("option:selected").text();
      self.getData(self.URL);
    }));
  };

  Section.prototype.reformatData = function () {
    for (var key in this.data.docs) {
      switch (true) {
        case (this.data.docs[key].workExperience < 1):
          this.data.docs[key].workExperienceName = "junior";
          break;
        case (this.data.docs[key].workExperience >= 1 && this.data.docs[key].workExperience < 3):
          this.data.docs[key].workExperienceName = "middle";
          break;
        case (this.data.docs[key].workExperience >= 3 && this.data.docs[key].workExperience < 10):
          this.data.docs[key].workExperienceName = "senior";
          break;
        default:
          this.data.docs[key].workExperienceName = "junior";
          break;
      }

    }
  };

  Section.prototype.InitializeFilterObj = function () {

    var self = this;
    $(self.filterItems).each(function (index, elem) {
      switch (elem.value) {
        case "Any":
          self.filterObj[index] = [];
          self.filterObj[index].push('');
          break;
        case "Junior":
          self.filterObj[index] = [0, 1];
          break;
        case "Middle":
          self.filterObj[index] = [1, 3];
          break;
        case "Senior":
          self.filterObj[index] = [3, 10];
          break;
        default:
          self.filterObj[index] = [];
          self.filterObj[index].push(elem.value);
          break;
      }
    });
  };

  Section.prototype.clear = function (element) {

    $(element).each(function (index, el) {
      el.remove();
    })
  };

  //change label text like '1-30 of 60' on table-editor
  Section.prototype.addItemInformation = function (length, page) {
    var lastItem;
    if (this.itemsPerPage * page > length) {
      lastItem = length;
    } else {
      lastItem = this.itemsPerPage * page;
    }
    this.itemsInformation.html((this.itemsPerPage * (page - 1) + 1) + ' - ' + lastItem + ' of ' + length);
  };


  Section.prototype.setPaginationOptions = function () {
    var self = this;
    this.defaultOptions = {
      totalPages: Math.ceil(self.data.count / self.itemsPerPage),
      itemOnPage: self.itemsPerPage,
      startPage: self.pagination.twbsPagination('getCurrentPage') || 1,
      initiateStartPageClick: false,
      cssStyle: '',
      prev: '<svg class="icon icon-prev-ARROW "><use xlink:href="assets/images/svg/symbol/sprite.svg#ARROW"></use></svg>',
      next: '<svg class="icon icon-ARROW "><use xlink:href="assets/images/svg/symbol/sprite.svg#ARROW"></use></svg>',
      onPageClick: function (evt, page) {
        self.getData();
      }
    };
  };

  //get 1 portion of data, it depends on itemsPerPage value
  Section.prototype.sortData = function (data, page) {

    var newData = [];
    if (page === undefined) page = 1;
    for (var i = this.itemsPerPage * (page - 1); i < this.itemsPerPage * page; i++) {
      if (data[i]) {
        newData.push(data[i]);
      }
    }
    return newData;
  };

  //async get data and set pagination
  Section.prototype.getDataFromServer = function (resolve) {
    var self = this;
    var currentPage = self.pagination.twbsPagination('getCurrentPage');

    (function () {
      $.get(self.URL, {currentPage: currentPage, limit: self.itemsPerPage, filter: self.filterObj}, function (data) {
        if (data.docs.length > 0) {
          self.data = data;
          self.setPaginationOptions(currentPage);
          self.reformatData();
          self.pagination.twbsPagination('destroy');
          self.pagination.twbsPagination(self.defaultOptions);
          self.addItemInformation(self.data.count, currentPage);
          self.clear(self.table.find('.table--row'));
          self.fillTable(currentPage);
        }
        else {
          self.clear(self.table.find('.hr-app__table__row'));
        }
        self.firstInit = false;
        resolve();
      });
    })();
  };

  // fill table func
  Section.prototype.fillTable = function () {
    // get table mobile or desktop -- structure a little bit different
    if (this.collapseElems) {
      this.getMobileTable();
    } else {
      this.getTable();
    }
    // binding mobile events there because we need to do it after getting table
    if (window.matchMedia('(max-width: 515px)').matches) {
      this.tableCollapseElems = $(this.table).find('[data-toggle="collapse"]');
      this.bindMobileEvents();
    }
  };
  function sqlToJsDate(sqlDate){
    if(sqlDate){
      //sqlDate in SQL DATETIME format ("yyyy-mm-dd hh:mm:ss.ms")
      var sqlDateWithoutTime = sqlDate.substring(0,sqlDate.indexOf("T"));
      var sqlDateArr1 = sqlDateWithoutTime.split("-");
      //format of sqlDateArr1[] = ['yyyy','mm','dd hh:mm:ms']
      var sYear = sqlDateArr1[0];
      var sMonth = sqlDateArr1[1];
      var sDay = sqlDateArr1[2];
      //format of sqlDateArr2[] = ['dd', 'hh:mm:ss.ms']
      return sYear + '.' + sMonth + '.' + sDay;
    }else return "Now"

  }

  Section.prototype.getTable = function () {
    var self = this;
    data = self.data;
    var headerRow = "";
    var row;
    var j;
    headerRow += '<div class="table--row hr-app__table__header-row">';
    for (var header in self.tableFields) {
      headerRow += '<div class="hr-app__table-col table--header-col col--' + header.toLowerCase() + '" id="table--header-col--pos">' + header + '</div>';
    }
    headerRow += '</div>';
    $(self.table).append(headerRow);
    for (var i = 0; i < self.data.docs.length; i++) {
      row = '<div class="hr-app__table__row table--row table-row--big">';
      j = 0;
      for (var key in self.tableFields) {
        j++;
        switch (key) {
          case "Photo":
            row += '<div class="hr-app__table-col col--' + key.toLowerCase() + '" data-toggle="collapse" data-target="" role="button" aria-expanded="false" aria-controls="filters-bar-collapse">' +
              '<div class="hr-app__table-col__photo"><img class="hr-app__table-col__photo-img" src="/assets/images/profiles/profile.jpg" alt=""></div></div>';
            break;
          case "View Candidate":
            row += '<div class="hr-app__table-col"><a class="hr-app__table-col__button" data-link="' + self.data.docs[i][self.tableFields[key]] + '" data-attr="tab-link" href="">View Candidate</a></div>';
            break;
          case "View Candidates":
            row += '<div class="hr-app__table-col"><a class="hr-app__table-col__button" href="vacancies/' + self.data.docs[i][self.tableFields[key]] + '">View Candidates</a></div>';
            break;
          default:
            switch (j) {
              case 0:
                row += '<div class="hr-app__table-col" data-toggle="collapse" data-target="#hr-app__table__xs-cols-wrap-" addrole="button" aria-expanded="false" aria-controls="filters-bar-collapse"><div class="hr-app__table-col__profession">' + self.data.docs[i][self.tableFields[key]] + '</div><svg class="icon icon-ARROW "><use xlink:href="assets/images/svg/symbol/sprite.svg#ARROW"></use></svg></div>';
                break;
              default:
                row += '<div class="hr-app__table-col"><div class="hr-app__table-col__advantages">' + self.data.docs[i][self.tableFields[key]] + '</div></div>';
            }
            break;
        }
      }
      $(self.table).append(row);
    }
  };

  Section.prototype.getMobileTable = function () {
    var row;
    for (var i = 0; i < this.data.docs.length; i++) {
      row = '<div class="hr-app__table__row table--row table-row--big">\n';
      row += '<div class="hr-app__table-col" data-toggle="collapse" data-target="#hr-app__table__xs-cols-wrap-' + i + '"addrole="button" aria-expanded="false" aria-controls="filters-bar-collapse"><div class="hr-app__table-col__profession">' + this.data.docs[i].position + '</div><svg class="icon icon-ARROW "><use xlink:href="assets/images/svg/symbol/sprite.svg#ARROW"></use></svg></div><div class="hr-app__table__xs-cols-wrap collapse" style="width: 100%;" data-parent="#hr-app__table" id="hr-app__table__xs-cols-wrap-' + i + '">';

      for (var key in this.tableFields) {
        switch (key) {
          case "Position":
            break;
          case "View Candidates":
            row += '<div class="hr-app__table-col"><a class="hr-app__table-col__button" href="#">View Candidates</a></div></div>';
            break;
          case "Photo":
            break;
          default:
            row += '<div class="hr-app__mobile-table-col-header">' + key + '</div>';
            row += '<div class="hr-app__table-col"><div class="hr-app__table-col__advantages">' + this.data.docs[i][this.tableFields[key]] + '</div></div>';
        }
      }
      $(this.table).append(row);
    }

    /*$(self.collapseElems).each(function (index, el) {
      self.addCollapse(el);
    });*/
  };


  // add collapse attributes to mobile elements
  Section.prototype.addCollapse = function addCollapse() {
    $(this.collapseElems).each(function (index, el) {
      var collapseTarget = ($($(el).next()).attr("id")) ? "#" + $($(el).next()).attr("id") : "." + $($(el).next()).attr("class");
      $($(el).next()).addClass("collapse");
      $(el).attr("data-target", collapseTarget);
      $(el).attr("aria-controls", collapseTarget.slice(1));
    });
  };


  var getUrlParameter = function getUrlParameter() {
    var vhref = $(location).attr('href');
    vhref = vhref.substr(vhref.lastIndexOf('/') + 1);
    return vhref;
  };


  Section.prototype.sortTable = function (n) {
    var rows, switching, i, x, y, shouldSwitch, switchcount = 0;
    var textCurItem, textNextItem;
    var dir = "asc";
    switching = true;

    while (switching) {
      switching = false;
      rows = $('.hr-app__table__row');

      for (i = 0; i < (rows.length - 1); i++) {

        shouldSwitch = false;// Start by saying there should be no switching:
        /* Get the two elements you want to compare,
        one from current row and one from the next: */

        x = ($(".hr-app__table-col", rows[i]))[n];
        y = ($(".hr-app__table-col", rows[i + 1]))[n];

        textCurItem = x.innerText.toLowerCase();
        textNextItem = y.innerText.toLowerCase();

        if (n === 2) {
          textCurItem = parseInt(textCurItem.slice(1));
          textNextItem = parseInt(textNextItem.slice(1));
        }

        /* Check if the two rows should switch place,
        based on the direction, asc or desc: */

        if (dir === "asc") {
          if (textCurItem > textNextItem) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        } else if (dir === "desc") {
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

        if (switchcount === 0 && dir === "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
  };


  Section.prototype.bindMobileEvents = function () {
    var self = this;

    if (typeof self.tableCollapseElems !== 'undefined') {
      $(self.tableCollapseElems.next()).on('show.bs.collapse', function () {
        $(this).prev().find('.icon-ARROW').addClass('rotate270');
        $(self.filterBar).addClass('slide-up');
        self.canSlide = false;
      });
      $(self.tableCollapseElems.next()).on('hide.bs.collapse', function (e) {
        $(this).prev().find('.icon-ARROW').removeClass('rotate270');
        if ($(self.table).children().length < 9) {
          self.canSlide = false;
        } else {
          self.canSlide = true;
        }
      });
    }

    var previousScroll = 0;
    if ($(self.table).children().length < 9) {
      self.canSlide = false;
    } else {
      self.canSlide = true;
    }
    $(this.table).on('scroll', function (event) {
      var currentScroll = $(this).scrollTop();
      previousScroll = self.slideFilterBarMobile(previousScroll, currentScroll);
    });
  };


  HrAppBuilder.prototype.showSidebar = function () {
    $(this.sidebar).addClass('slide-in');
  };
  HrAppBuilder.prototype.hideSidebar = function () {
    $(this.sidebar).removeClass('slide-in');
  };

  Section.prototype.slideFilterBar = function (previousScroll, currentScroll) {
    if (currentScroll > 200) {
      $(this.filterBar).addClass('slide-up');
    } else if (currentScroll === 0) {
      $(this.filterBar).removeClass('slide-up');
    }
    return previousScroll = currentScroll;
  };


  Section.prototype.slideFilterBarMobile = function (previousScroll, currentScroll) {
    switch (true) {
      case (currentScroll >= previousScroll && this.canSlide):
        $(this.filterBar).addClass('slide-up');
        break;
      case (currentScroll === 0):
        $(this.filterBar).removeClass('slide-up');
        break;
    }
    return currentScroll;
  };

  var hrAppWrapper = $(document).find(".hr-app-section");
  // if page -- HR-app initialize object
  if (hrAppWrapper.length > 0) {
    new HrAppBuilder(hrAppWrapper);
  }

  // if page -- Create profile - -  initialize object
  var createProfileWrapper = $(document).find(".createProfile__edit-block");
  if (createProfileWrapper.length > 0) {
    new ProfileBuilder(createProfileWrapper);
  }


// Review PopUp Opening/Closing function
  $(function () {
//----- OPEN
    $('[data-popup-open]').on('click', function (e) {
      var targeted_popup_class = jQuery(this).attr('data-popup-open');
      $('[data-popup="' + targeted_popup_class + '"]').fadeIn(350);
      e.preventDefault();
    });
//----- CLOSE
    $('[data-popup-close]').on('click', function (e) {
      var targeted_popup_class = jQuery(this).attr('data-popup-close');
      $('[data-popup="' + targeted_popup_class + '"]').fadeOut(350);
      e.preventDefault();
    });
    
  });

// Review Creating function
  $("#review-creating").click(function () {
    var body = document.getElementsByClassName('review-block__body');
    var bodyElem = document.createElement('div');
    $(bodyElem).addClass('review-block__body-elem row');
    bodyElem.innerHTML = '<div class=\"review-block__reviewer-name review-to-be-hidden col-3 display-none\">Reviewer Name</div>\n' +
      '                         <input type=\"text\" placeholder=\"Reviewer Name\" class=\"review-input reviewer-name-inp col-3\">\n' +
      '                         <div class=\"review-block__review-text review-to-be-hidden col-6 display-none\">Review Text</div>\n' +
      '                         <input type=\"text\" placeholder=\"Text of the review\" class=\"review-input review-text-inp col-6\">\n' +
      '                         <div class=\"review-block__date review-to-be-hidden col-3 display-none\" id=\"date-out\">16.03.2018</div>\n' +
      '                        <input type=\"text\" placeholder="Choose date" class=\"review-input datepicker col-3\">';

    document.getElementById('rev-body').appendChild(bodyElem);
    var editButton = document.getElementsByClassName('edit-btn');
    $(editButton).addClass('display-none');
    var saveButton = document.getElementsByClassName('save-btn');
    $(saveButton).removeClass('display-none');
    var dateId = document.getElementsByClassName('review-block__date');
    for (var i = 0; i < dateId.length; i++) {
      dateId[i].id = 'date-out-' + (i + 1);
    }
    $(function () {
      $(".datepicker").datepicker({dateFormat: 'dd.mm.yy'});
    });
  });

//Review PopUp Editing function
  $("#review-editing").click(function () {
    var allInputs = document.getElementsByClassName('review-input');
    for (var i = 0; i < allInputs.length; i++) {
      $(allInputs[i]).removeClass('display-none');
    }
    var hidden = document.getElementsByClassName('review-to-be-hidden');
    for (i = 0; i < hidden.length; i++) {
      $(hidden[i]).addClass('display-none');
    }
    var editButton = document.getElementsByClassName('edit-btn');
    $(editButton).addClass('display-none');
    var saveButton = document.getElementsByClassName('save-btn');
    $(saveButton).removeClass('display-none');
    $(function () {
      $(".datepicker").datepicker({dateFormat: 'dd.mm.yy'});
    });
  });


  $("#review-saving").click(function () {
    var allInputs = document.getElementsByClassName('review-input');
    for (var i = 0; i < allInputs.length; i++) {
      $(allInputs[i]).addClass('display-none');
    }
    var hidden = document.getElementsByClassName('review-to-be-hidden');
    for (i = 0; i < hidden.length; i++) {
      $(hidden[i]).removeClass('display-none');
    }
    var editButton = document.getElementsByClassName('edit-btn');
    $(editButton).removeClass('display-none');
    var saveButton = document.getElementsByClassName('save-btn');
    $(saveButton).addClass('display-none');
    var dateInpElem = document.getElementsByClassName('datepicker');
    for (var i = 0; i < dateInpElem.length; i++) {
      var dateInp = document.getElementsByClassName('datepicker');
      var dateOut = document.getElementsByClassName('review-block__date');
      dateOut[i].innerHTML = dateInp[i].value;

      var nameInp = document.getElementsByClassName('reviewer-name-inp');
      var nameOut = document.getElementsByClassName('review-block__reviewer-name')
      nameOut[i].innerHTML = nameInp[i].value;

      var textInp = document.getElementsByClassName('review-text-inp');
      var textOut = document.getElementsByClassName('review-block__review-text');
      textOut[i].innerHTML = textInp[i].value;
    }
  });

  function CustomDropdown(dropDown) {
    this.dropDown = dropDown;
    this.dropDownLink = $(this.dropDown).find('.hr-app__filters-bar__dropdown-item-link');
    this.activeItem = $(this.dropDown).find('.hr-app__filters-bar__dropdown-active-value') ;
    var self = this;
    this.bindEvents = function () {
      this.dropDownLink.on('click',function () {
        $(self.activeItem).find('span').text($(this).text());
        return false;
      });
    };
    this.bindEvents();
  }
});


// Review PopUp Opening/Closing function
$(function() {
//----- OPEN
    $('[data-popup-open]').on('click', function(e)  {
        var targeted_popup_class = jQuery(this).attr('data-popup-open');
        $('[data-popup="' + targeted_popup_class + '"]').fadeIn(350);
        e.preventDefault();
    });
//----- CLOSE
    $('[data-popup-close]').on('click', function(e)  {
        var targeted_popup_class = jQuery(this).attr('data-popup-close');
        $('[data-popup="' + targeted_popup_class + '"]').fadeOut(350);
        e.preventDefault();
    });
});

// Review Creating function
$("#review-creating").click(function () {
    var body = document.getElementsByClassName('review-block__body');
    var bodyElem = document.createElement('div');
    $(bodyElem).addClass('review-block__body-elem row');
    bodyElem.innerHTML = '<div class=\"review-block__reviewer-name review-to-be-hidden col-3 display-none\">Reviewer Name</div>\n' +
        '                         <input type=\"text\" placeholder=\"Reviewer Name\" class=\"review-input reviewer-name-inp col-3\">\n' +
        '                         <div class=\"review-block__review-text review-to-be-hidden col-6 display-none\">Review Text</div>\n' +
        '                         <input type=\"text\" placeholder=\"Text of the review\" class=\"review-input review-text-inp col-6\">\n' +
        '                         <div class=\"review-block__date review-to-be-hidden col-3 display-none\" id=\"date-out\">16.03.2018</div>\n' +
        '                        <input type=\"text\" placeholder="Choose date" class=\"review-input datepicker col-3\">';

    document.getElementById('rev-body').appendChild(bodyElem);
    var editButton = document.getElementsByClassName('edit-btn');
    $(editButton).addClass('display-none');
    var saveButton = document.getElementsByClassName('save-btn');
    $(saveButton).removeClass('display-none');
    var dateId = document.getElementsByClassName('review-block__date');
    for (var i = 0; i < dateId.length; i++){
        dateId[i].id = 'date-out-'+(i+1);
    }
    $( function() {
        $( ".datepicker" ).datepicker({dateFormat: 'dd.mm.yy'});
    } );
});

//Review PopUp Editing function
$("#review-editing").click(function(){
    var allInputs = document.getElementsByClassName('review-input');
    for(var i=0; i<allInputs.length; i++){
        $(allInputs[i]).removeClass('display-none');
    }
    var hidden = document.getElementsByClassName('review-to-be-hidden');
    for(i=0; i<hidden.length; i++){
        $(hidden[i]).addClass('display-none');
    }
    var editButton = document.getElementsByClassName('edit-btn');
    $(editButton).addClass('display-none');
    var saveButton = document.getElementsByClassName('save-btn');
    $(saveButton).removeClass('display-none');
    $( function() {
        $( ".datepicker" ).datepicker({dateFormat: 'dd.mm.yy'});
    } );
});

$("#review-saving").click(function () {
    var allInputs = document.getElementsByClassName('review-input');
    for(var i=0; i<allInputs.length; i++){
        $(allInputs[i]).addClass('display-none');
    }
    var hidden = document.getElementsByClassName('review-to-be-hidden');
    for(i=0; i<hidden.length; i++){
        $(hidden[i]).removeClass('display-none');
    }
    var editButton = document.getElementsByClassName('edit-btn');
    $(editButton).removeClass('display-none');
    var saveButton = document.getElementsByClassName('save-btn');
    $(saveButton).addClass('display-none');
    var dateInpElem = document.getElementsByClassName('datepicker');
    for (var i=0; i<dateInpElem.length; i++){
        var dateInp = document.getElementsByClassName('datepicker');
        var dateOut = document.getElementsByClassName('review-block__date');
        dateOut[i].innerHTML = dateInp[i].value;

        var nameInp = document.getElementsByClassName('reviewer-name-inp');
        var nameOut = document.getElementsByClassName('review-block__reviewer-name')
        nameOut[i].innerHTML = nameInp[i].value;

        var textInp = document.getElementsByClassName('review-text-inp');
        var textOut = document.getElementsByClassName('review-block__review-text');
        textOut[i].innerHTML = textInp[i].value;
    }
});

