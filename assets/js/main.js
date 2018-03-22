$(document).ready(function () {

  function HrAppBuilder(elem) {
    //initialize DOM elements which we will working with
    this.section = elem;
    this.sidebar = $(this.section).find('.hr-app-section__sidebar');
    this.tabLinks = $(this.section).find('.hr-app-section__sidebar-item-link');
    var self = this;
    this.application;
    //if we on page vacancies we initializing vacancies object which described below
    this.bindEvents();
    //if we're working on smart-phone, initialize some special variables and bind mobile events
    this.bindMobileEvents = function () {
      $(this.toggleButton).on('click', function () {
        self.showSidebar();
      });
      $(this.crossButton).on('click', function () {
        self.hideSidebar();
      });
    };
    this.clear = function () {
      $(this.section).find('.table--row').each(function (index, el) {
        $(el).remove();
      });
    };

    if (window.matchMedia('(max-width: 515px)').matches) {
      this.toggleButton = $(this.section).find('.icon-HAMBURGER');
      this.crossButton = $(this.sidebar).find('.icon-CLOSE');
      this.bindMobileEvents();
    }
  }

  function Section(element, tableName, filterBarId) {
    this.section = element;
    this.filterBar = this.section.find(filterBarId);
    this.vacancies = [];
    this.table = $(this.section).find(tableName);
    this.itemsCountSelect = $(this.table).find('#rows-per-page-vacancies');
    this.pagination = $(this.section).find('#pagination');
    this.itemsPerPage = +($(this.section).find("#rows-per-page-vacancies option:selected").text());
    this.itemsInformation = $(this.table).find('.hr-app__table-editor__pagination');
    this.filterItems = $(this.filterBar).find('[data-attr="filter-item"]');

    //Data - our data which will be in the table
    this.data = [];
    this.filterObj = [];

    //defaultOptions - it's options for pagination
    this.defaultOptions = {};
  }

  Object.setPrototypeOf(Candidates.prototype, Section.prototype);

  function Candidates(element) {
    Section.call(this, element, "#hr-app__table", "#candidates-filters-bar");

    this.InitializeFilterObj();
    this.URL = "/candidates";
    this.filterItems = $(this.filterBar).find('[data-attr="filter-item"]');
    this.tableFields = {
      Photo: "",
      Name: "name",
      Position: "position",
      Status: "status"
    };

    this.getDataFromServer();

    /*this.getTable = function (data) {
      var self = this;
      var row;
      var col;
      var j = 0;
      row = '';
      for (var i = 0; i < data.length; i++) {
        if (j === 0) {
          row = '<div class="row">';
        }
        j++;
        col = '<div class="col-lg-3"><div class="hr-app__candidates-item d-flex flex-column"><a href="#" class="hr-app__candidates-item-link"><div class="hr-app__candidates-item__img-wrap"><img class="hr-app__candidates-item__img" src="assets/images/profiles/profile.jpg" alt="profile"><div class="hr-app__candidates-item-cv-text">'+data[i].status+'</div></div> <div class="hr-app__candidates-item-text-wrapper"><span class="hr-app__candidates-item--profession-text">'+data[i].position+'</span><h5 class="hr-app__candidates-item-name-text">'+data[i].firstName+" "+data[i].secondName+'</h5><span class="hr-app__candidates-item-salary-text">'+data[i].salary+'</span></div></a></div></div>';
        row += col;
        if (j === 4||i===data.length-1) {
          row += '</div>';
          j = 0;
          $(self.table).append(row);
        }

      }
    };*/

    if (window.matchMedia('(max-width: 515px)').matches) {
      //this is for sliding filter-panel
      $('.hr-app__table-editor__text').html('Rows');
      this.canSlide = true;
      this.collapseElems = $(this.section).find('[data-toggle="collapse"]');
      this.addCollapse();
      this.bindMobileEvents();
    } else {
      this.bindEvents();
    }
    this.bindCommonEvents();
  }

  Object.setPrototypeOf(Vacancies.prototype, Section.prototype);

  function Vacancies(element) {
    Section.call(this, element, "#hr-app__table", "#vacancies-filters-bar");
    this.InitializeFilterObj();
    this.URL = "/vacancies";
    this.getDataFromServer(this.URL);
    this.tableFields = {
      Position: "position",
      Requirements: "requirements",
      "Work Experience": "workExperienceName",
      "View Candidates": "link"
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
    //common events
    this.bindCommonEvents();
  }

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
      self.getDataFromServer(self.URL);
    });
  };

  Section.prototype.reformatData = function () {
    for(var key in this.data.docs){
      switch (true){
        case (this.data.docs[key].workExperience<1):
          this.data.docs[key].workExperienceName = "junior";
          break;
        case (this.data.docs[key].workExperience>=1&&this.data.docs[key].workExperience<3):
          this.data.docs[key].workExperienceName = "middle";
          break;
        case (this.data.docs[key].workExperience>=3&&this.data.docs[key].workExperience<10):
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
      switch (elem.value){
        case "Any":
          self.filterObj[index] = [];
          self.filterObj[index].push('');
          break;
        case "Junior":
          self.filterObj[index] = [0,1];
          break;
        case "Middle":
          self.filterObj[index] = [1,3];
          break;
        case "Senior":
          self.filterObj[index] = [3,10];
          break;
        default:
          self.filterObj[index]=[];
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
        self.getDataFromServer();
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
  Section.prototype.getDataFromServer = function () {
    var self = this;
    var currentPage = self.pagination.twbsPagination('getCurrentPage');
    console.log(self.filterObj);

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
      row = '<div class="hr-app__table__row table--row table-row--big">\n';
      j = 0;
      for (var key in self.tableFields) {
        j++;
        if (key === "Photo") {
          row += '<div class="hr-app__table-col col--' + key.toLowerCase() + '" data-toggle="collapse" data-target="" role="button" aria-expanded="false" aria-controls="filters-bar-collapse">' +
            '<div class="hr-app__table-col__photo"><img class="hr-app__table-col__photo-img" src="/assets/images/profiles/profile.jpg" alt=""></div></div>';
        } else if (key === "View Candidates") {
          row += '<div class="hr-app__table-col"><a class="hr-app__table-col__button" href="#">View candidates</a></div>';
          break;
        }
        else {
          switch (j) {
            case 0:
              row += '<div class="hr-app__table-col" data-toggle="collapse" data-target="#hr-app__table__xs-cols-wrap-" addrole="button" aria-expanded="false" aria-controls="filters-bar-collapse"><div class="hr-app__table-col__profession">' + self.data.docs[i][self.tableFields[key]] + '</div><svg class="icon icon-ARROW "><use xlink:href="assets/images/svg/symbol/sprite.svg#ARROW"></use></svg></div>';
              break;
            default:
              row += '<div class="hr-app__table-col"><div class="hr-app__table-col__advantages">' + self.data.docs[i][self.tableFields[key]] + '</div></div>';
          }
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
        switch (key){
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

  HrAppBuilder.prototype.bindEvents = function () {
    var self = this;
    $(self.tabLinks).on('click', function (e) {
      e.preventDefault();
      self.tabLinks.removeClass("active");
      self.clear();
      $(self.tabLinks).each(function (index, elem) {
        $($(elem).attr('data-target')).removeClass("active").addClass("d-none");
      });
      $($(this).attr('data-target')).removeClass("d-none").addClass("active");
      if ($(self.section.find('#vacancies-tab')).hasClass('active')) {
        self.application = new Vacancies(self.section.find('#vacancies-tab'));
      }
      if ($(self.section.find('#candidates-tab')).hasClass('active')) {
        self.application = new Candidates(self.section.find('#candidates-tab'));
      }
    });
  };


  Section.prototype.bindCommonEvents = function () {
    var self = this;
    $(this.itemsCountSelect.on('change', function () {
      self.itemsPerPage = $(this).find("option:selected").text();
      self.getDataFromServer(self.URL);
    }));
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
        if($(self.table).children().length<9){
          self.canSlide=false;
        }else {
          self.canSlide=true;
        }
      });
    }

    var previousScroll = 0;
    if($(self.table).children().length<9){
      self.canSlide=false;
    }else {
      self.canSlide=true;
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


  HrAppBuilder.prototype.showSidebar = function () {
    $(this.sidebar).addClass('slide-in');
  };
  HrAppBuilder.prototype.hideSidebar = function () {
    $(this.sidebar).removeClass('slide-in');
  };

  Section.prototype.slideFilterBarMobile = function (previousScroll, currentScroll) {
    switch (true){
      case (currentScroll >= previousScroll && this.canSlide):
        $(this.filterBar).addClass('slide-up');
        break;
      case (currentScroll === 0):
        $(this.filterBar).removeClass('slide-up');
        break;
    }
    return currentScroll;
    /*if (currentScroll < this.table.height() / 2) {
      if (currentScroll >= previousScroll || !this.canSlide) {
        $(this.filterBar).addClass('slide-up');
      } else {
        $(this.filterBar).removeClass('slide-up');
      }
    } else {
      return 0;
    }*/

  };

  var hrAppWrapper = $(document).find(".hr-app-section");
  // if page -- HR-app initialize object
  if (hrAppWrapper.length > 0) {
    new HrAppBuilder(hrAppWrapper);
  }
  $("#cands-editing-icon").click(function () {
    var allInputs = document.getElementsByTagName('input');
    for (var i = 0; i < allInputs.length; i++) {
      $(allInputs[i]).removeClass('display-none');
    }
    var allTextareas = document.getElementsByTagName('textarea');
    for (i = 0; i < allTextareas.length; i++) {
      $(allTextareas[i]).removeClass('display-none');
    }
    var hidden = document.getElementsByClassName('to-be-hidden');
    for (i = 0; i < hidden.length; i++) {
      $(hidden[i]).addClass('display-none');
    }
  });
});





