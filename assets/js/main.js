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

  //this object is our HR-application -- all behavior described there
  function HrAppBuilder(elem) {
    //initialize DOM elements which we will working with
    this.section = elem;
    this.sidebar = $(this.section).find('.hr-app-section__sidebar');
    this.tabLinks = $(this.section).find('.hr-app-section__sidebar-item-link');
    this.application;

    //if we on page vacancies we initializing vacancies object which described below
    this.bindEvents();

    //if we're working on smart-phone, initialize some special variables and bind mobile events
    if (window.matchMedia('(max-width: 515px)').matches) {
      this.toggleButton = $(this.section).find('.icon-HAMBURGER');
      this.crossButton = $(this.sidebar).find('.icon-CLOSE');

      this.bindMobileEvents();
    } else {
      //else bind desktop events

    }

  }

  //all objects have their functions, which are available from their prototypes
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
  //simply function to add preview image -- nothing special
  ProfileBuilder.prototype.addPreview = function (evt) {
    if ($(this.photoInput).length > 0) {
      $(this.previewBlock).attr('src', window.URL.createObjectURL(this.photoInput.files[0]));
      $(this.previewText).html(this.photoInput.files[0].name);
    }
  };

  function Candidates(element) {
    this.section = element;
    this.filterBar = this.section.find('#candidates-filters-bar');
    this.vacancies = [];
    this.table = $(this.section).find('#hr-app__candidates-items-wrapper');
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
    //async initializing data and creating pagination
    this.getData();
    if (window.matchMedia('(max-width: 515px)').matches) {
      //this is for sliding filter-panel
      $('.hr-app__table-editor__text').html('Rows');
      this.canSlide = true;
      this.collapseElems = $(this.section).find('[data-toggle="collapse"]');
      this.addCollapse(this.collapseElems);

      this.bindMobileEvents();
    } else {
      //not mobile events
      this.bindEvents();
    }
    this.bindCommonEvents();
  }

  //object vacancies -- all, what we're doing in this section described there
  function Vacancies(element) {
    //DOM elements
    this.section = element;

    this.filterBar = this.section.find('.hr-app__filters-bar');
    this.vacancies = [];
    this.table = $(this.section).find('#hr-app__table');
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
    //async initializing data and creating pagination
    this.getData();

    //mobile branch
    if (window.matchMedia('(max-width: 515px)').matches) {
      //this is for sliding filter-panel
      $('.hr-app__table-editor__text').html('Rows');
      this.canSlide = true;
      this.collapseElems = $(this.section).find('[data-toggle="collapse"]');
      this.bindMobileEvents();
    } else {
      //not mobile events
      this.bindEvents();
    }
    //common events
    this.bindCommonEvents();
  }

  Vacancies.prototype.bindEvents = function () {
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
      self.getData();
    });
  };
  Candidates.prototype.bindEvents = function () {
    var self = this;

    var previousScroll = 0;
    $(this.table).on('scroll', function (event) {
      var currentScroll = $(this).scrollTop();
      previousScroll = self.slideFilterBar(previousScroll, currentScroll);
    });

    self.filterItems.on('input', function () {
      self.InitializeFilterObj(self.filterItems);
      self.getData();
    });
  };
  Vacancies.prototype.filterTable = function () {

    var self = this;
    var newData = [];
    var i = 0;
    this.data.forEach(function (item) {
      if (
        (self.filterObj[1].toLowerCase() === "any" || ~item.workExperience.toLowerCase().indexOf(self.filterObj[1].toLowerCase())) &&
        ~item.position.toLowerCase().indexOf(self.filterObj[0].toLowerCase()) &&
        (self.filterObj[2] === "" || (+item.salary.slice(1) > +self.filterObj[2])) &&
        (self.filterObj[3] === "" || (+item.salary.slice(1) < +self.filterObj[3]))
      )
        newData.push(item);
    });
    self.data = newData;
  };
  Candidates.prototype.filterTable = function () {

    var self = this;
    var newData = [];
    var i = 0;
    this.data.forEach(function (item) {
      if (
        self.filterObj[0].toLowerCase() === "any" || ~item.status.toLowerCase().indexOf(self.filterObj[0].toLowerCase())
      )
        newData.push(item);
    });
    self.data = newData;
  };
  Vacancies.prototype.InitializeFilterObj = function (elem) {
    var self = this;
    $(elem).each(function (index, elem) {
      self.filterObj[index] = elem.value;
    });
  };
  Candidates.prototype.InitializeFilterObj = function (elem) {
    var self = this;
    $(elem).each(function (index, elem) {
      self.filterObj[index] = elem.value;
    });
  };

  Vacancies.prototype.clear = function (element) {
    $(element).each(function (index, el) {
      el.remove();
    })
  };

  Candidates.prototype.clear = function (element) {
    $(element).each(function (index, el) {
      el.remove();
    })
  };

  //change label text like '1-30 of 60' on table-editor
  Vacancies.prototype.addItemInformation = function (length, page) {
    var lastItem;
    if (this.itemsPerPage * page > length) {
      lastItem = length;
    } else {
      lastItem = this.itemsPerPage * page;
    }
    this.itemsInformation.html((this.itemsPerPage * (page - 1) + 1) + ' - ' + lastItem + ' of ' + length);
  };
  Candidates.prototype.addItemInformation = function (length, page) {
    var lastItem;
    if (this.itemsPerPage * page > length) {
      lastItem = length;
    } else {
      lastItem = this.itemsPerPage * page;
    }
    this.itemsInformation.html((this.itemsPerPage * (page - 1) + 1) + ' - ' + lastItem + ' of ' + length);
  };


  Vacancies.prototype.setPaginationOptions = function (currentPage) {
    var self = this;
    this.defaultOptions = {
      totalPages: Math.ceil(self.data.length / self.itemsPerPage),
      itemOnPage: self.itemsPerPage,
      currentPage: currentPage,
      cssStyle: '',
      prev: '<svg class="icon icon-prev-ARROW "><use xlink:href="assets/images/svg/symbol/sprite.svg#ARROW"></use></svg>',
      next: '<svg class="icon icon-ARROW "><use xlink:href="assets/images/svg/symbol/sprite.svg#ARROW"></use></svg>',
      onPageClick: function (evt, page) {
        self.addItemInformation(self.data.length, page);
        self.clear(self.table.find('.table--row'));
        self.fillTable(page);
      }
    };
  };
  Candidates.prototype.setPaginationOptions = function (currentPage) {
    var self = this;
    this.defaultOptions = {
      totalPages: Math.ceil(self.data.length / self.itemsPerPage),
      itemOnPage: self.itemsPerPage,
      currentPage: currentPage,
      cssStyle: '',
      prev: '<svg class="icon icon-prev-ARROW "><use xlink:href="assets/images/svg/symbol/sprite.svg#ARROW"></use></svg>',
      next: '<svg class="icon icon-ARROW "><use xlink:href="assets/images/svg/symbol/sprite.svg#ARROW"></use></svg>',
      onPageClick: function (evt, page) {
        self.addItemInformation(self.data.length, page);
        self.clear(self.table.find('.row'));
        self.fillTable(page);
      }
    };
  };

  //get 1 portion of data, it depends on itemsPerPage value
  Vacancies.prototype.sortData = function (data, page) {

    var newData = [];
    if (page === undefined) page = 1;
    for (var i = this.itemsPerPage * (page - 1); i < this.itemsPerPage * page; i++) {
      if (data[i]) {
        newData.push(data[i]);
      }
    }
    return newData;
  };
  Candidates.prototype.sortData = function (data, page) {

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
  Vacancies.prototype.getData = function () {
    var self = this;
    (function () {
      var URL = "assets/json/vacancies.json";
      $.getJSON(URL, {
        format: "json"
      })
        .done(function (data) {
          self.data = data;
          if (self.isFilter()) {
            self.filterTable();
          }
          if (self.data.length > 0) {
            var currentPage = self.pagination.twbsPagination('getCurrentPage');
            self.setPaginationOptions(currentPage);
            self.pagination.twbsPagination('destroy');
            self.pagination.twbsPagination(self.defaultOptions);
          }
        });
    })();
  };
  Candidates.prototype.getData = function (URL) {
    var self = this;
    (function () {
      var URL = "assets/json/candidates.json";
      $.getJSON(URL, {
        format: "json"
      })
        .done(function (data) {
          self.data = data;
          if (self.isFilter()) {
            self.filterTable();
          }
          if (self.data.length > 0) {
            var currentPage = self.pagination.twbsPagination('getCurrentPage');
            self.setPaginationOptions(currentPage);
            self.pagination.twbsPagination('destroy');
            self.pagination.twbsPagination(self.defaultOptions);
          }
        });
    })();
  };
  Vacancies.prototype.isFilter = function () {
    var f = false;
    this.filterObj.forEach(function (value) {
      if (value !== "" && value !== "Any") {
        f = true;
      }
    });
    return f;
  };
  Candidates.prototype.isFilter = function () {
    var f = false;
    this.filterObj.forEach(function (value) {
      if (value !== "" && value !== "Any") {
        f = true;
      }
    });
    return f;
  };
  // fill table func
  Vacancies.prototype.fillTable = function (page) {
    var self = this;

    // get portion of data
    var data = self.sortData(self.data, page);

    // get table mobile or desktop -- structure a little bit different
    if (self.collapseElems) {
      self.getMobileTable(data);
    } else {
      self.getTable(data);
    }
    // binding mobile events there because we need to do it after getting table
    if (window.matchMedia('(max-width: 515px)').matches) {
      self.tableCollapseElems = $(self.table).find('[data-toggle="collapse"]');
      self.bindMobileEvents();
    }
  };

  Candidates.prototype.fillTable = function (page) {
    var self = this;

    // get portion of data
    var data = self.sortData(self.data, page);
    // get table mobile or desktop -- structure a little bit different

    self.getTable(data);

  };



  Vacancies.prototype.getTable = function (data) {
    var self = this;
    self.vacancies = data;
    var row;
    for (var i = 0; i < data.length; i++) {
      row = '<div class="hr-app__table__row table--row table-row--big">\n';
      for (var key in self.vacancies[i]) {
        switch (key) {
          case "position":
            row += '<div class="hr-app__table-col" data-toggle="collapse" data-target="#hr-app__table__xs-cols-wrap-" addrole="button" aria-expanded="false" aria-controls="filters-bar-collapse"><div class="hr-app__table-col__profession">' + self.vacancies[i][key] + '</div><svg class="icon icon-ARROW "><use xlink:href="assets/images/svg/symbol/sprite.svg#ARROW"></use></svg></div>';
            break;
          case "viewСandidates":
            row += '<div class="hr-app__table-col"><a class="hr-app__table-col__button" href="#">' + self.vacancies[i][key] + '</a></div>';
            break;
          default:
            row += '<div class="hr-app__table-col"><div class="hr-app__table-col__advantages">' + self.vacancies[i][key] + '</div></div>';
        }
      }
      $(self.table).append(row);
    }
  };

  Candidates.prototype.getTable = function (data) {
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
      col = '<div class="col-lg-3"><div class="hr-app__candidates-item d-flex flex-column"><a href="#" class="hr-app__candidates-item-link"><div class="hr-app__candidates-item__img-wrap"><img class="hr-app__candidates-item__img" src="assets/images/profiles/profile.jpg" alt="profile"><div class="hr-app__candidates-item-cv-text">'+data[i].status+'</div></div> <div class="hr-app__candidates-item-text-wrapper"><span class="hr-app__candidates-item--profession-text">Java Developer</span><h5 class="hr-app__candidates-item-name-text">'+data[i].name+'</h5><span class="hr-app__candidates-item-salary-text">800$</span></div></a></div></div>';
      row += col;
      if (j === 4||i===data.length-1) {
        row += '</div>';
        j = 0;
        $(self.table).append(row);
      }

    }
  };

  Vacancies.prototype.getMobileTable = function (data) {
    var self = this;
    self.vacancies = data;
    var row;
    var mobileHeaders = ['Status', 'Salary'];
    for (var i = 0; i < data.length; i++) {
      row = '<div class="hr-app__table__row table--row table-row--big">\n';
      var j = 0;
      for (var key in self.vacancies[i]) {
        if (j === 0) {
          row += '<div class="hr-app__table-col" data-toggle="collapse" data-target="#hr-app__table__xs-cols-wrap-' + i + '"addrole="button" aria-expanded="false" aria-controls="filters-bar-collapse"><div class="hr-app__table-col__profession">' + self.vacancies[i][key] + '</div><svg class="icon icon-ARROW "><use xlink:href="assets/images/svg/symbol/sprite.svg#ARROW"></use></svg></div><div class="hr-app__table__xs-cols-wrap collapse" style="width: 100%;" data-parent="#hr-app__table" id="hr-app__table__xs-cols-wrap-' + i + '">';
        } else if (j === Object.keys(self.vacancies[i]).length - 1) {
          row += '<div class="hr-app__table-col"><a class="hr-app__table-col__button" href="#">' + self.vacancies[i][key] + '</a></div></div>';
        } else {
          row += '<div class="hr-app__mobile-table-col-header">' + mobileHeaders[j - 1] + '</div>';
          row += '<div class="hr-app__table-col"><div class="hr-app__table-col__advantages">' + self.vacancies[i][key] + '</div></div>';
        }
        j++;
      }
      $(self.table).append(row);
    }

    $(self.collapseElems).each(function (index, el) {
      self.addCollapse(el);
    });


  };

  // add collapse attributes to mobile elements
  Vacancies.prototype.addCollapse = function addCollapse(elems) {
    $(elems).each(function (index, el) {
      var collapseTarget = ($($(el).next()).attr("id")) ? "#" + $($(el).next()).attr("id") : "." + $($(el).next()).attr("class");
      $($(el).next()).addClass("collapse");
      $(el).attr("data-target", collapseTarget);
      $(el).attr("aria-controls", collapseTarget.slice(1));
    });
  };
  Candidates.prototype.addCollapse = function addCollapse(elems) {
    $(elems).each(function (index, el) {
      var collapseTarget = ($($(el).next()).attr("id")) ? "#" + $($(el).next()).attr("id") : "." + $($(el).next()).attr("class");
      $($(el).next()).addClass("collapse");
      $(el).attr("data-target", collapseTarget);
      $(el).attr("aria-controls", collapseTarget.slice(1));
    });
  };
  HrAppBuilder.prototype.bindEvents = function () {
    var self = this;
    $(self.tabLinks).on('click',function(e){
      e.preventDefault();
      self.tabLinks.removeClass("active");
      $(self.tabLinks).each(function(index, elem){
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

  HrAppBuilder.prototype.bindMobileEvents = function () {
    var self = this;

    $(this.toggleButton).on('click', function () {
      self.showSidebar();
    });

    $(this.crossButton).on('click', function () {
      self.hideSidebar();
    });
  };
  Vacancies.prototype.bindCommonEvents = function () {
    var self = this;
    $(this.itemsCountSelect.on('change', function () {
      self.itemsPerPage = $(this).find("option:selected").text();
      self.getData();
    }));
  };
  Candidates.prototype.bindCommonEvents = function () {
    var self = this;
    $(this.itemsCountSelect.on('change', function () {
      self.itemsPerPage = $(this).find("option:selected").text();
      self.getData();
    }));
  };

  Vacancies.prototype.sortTable = function (n) {
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
  Candidates.prototype.sortTable = function (n) {
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

  Vacancies.prototype.bindMobileEvents = function () {
    var self = this;

    if(typeof self.tableCollapseElems !== 'undefined'){
      $(self.tableCollapseElems.next()).on('show.bs.collapse', function () {
        $(this).prev().find('.icon-ARROW').addClass('rotate270');
        $(self.filterSection).addClass('slide-up');
        self.canSlide = false;
      });
      $(self.tableCollapseElems.next()).on('hide.bs.collapse', function (e) {
        $(this).prev().find('.icon-ARROW').removeClass('rotate270');
        self.canSlide = true;
      });
    }

    var previousScroll = 0;
    $(this.table).on('scroll', function (event) {
      var currentScroll = $(this).scrollTop();
      previousScroll = self.slideFilterBarMobile(previousScroll, currentScroll);
    });
  };
  Candidates.prototype.bindMobileEvents = function () {
    var self = this;

    if(typeof self.tableCollapseElems !== 'undefined'){
      $(self.tableCollapseElems.next()).on('show.bs.collapse', function () {
        $(this).prev().find('.icon-ARROW').addClass('rotate270');
        $(self.filterSection).addClass('slide-up');
        self.canSlide = false;
      });
      $(self.tableCollapseElems.next()).on('hide.bs.collapse', function (e) {
        $(this).prev().find('.icon-ARROW').removeClass('rotate270');
        self.canSlide = true;
      });
    }

    var previousScroll = 0;
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

  Vacancies.prototype.slideFilterBar = function (previousScroll, currentScroll) {
    if (currentScroll > 200) {
      $(this.filterBar).addClass('slide-up');
    } else if (currentScroll === 0) {
      $(this.filterBar).removeClass('slide-up');
    }
    return previousScroll = currentScroll;
  };
  Candidates.prototype.slideFilterBar = function (previousScroll, currentScroll) {
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
  Vacancies.prototype.slideFilterBar = function (previousScroll, currentScroll) {
    if (currentScroll > 200) {
      $(this.filterBar).addClass('slide-up');
    } else if (currentScroll === 0) {
      $(this.filterBar).removeClass('slide-up');
    }
    return previousScroll = currentScroll;
  };
  Vacancies.prototype.slideFilterBarMobile = function (previousScroll, currentScroll) {
    if (currentScroll < this.table.height() / 2) {
      if (currentScroll >= previousScroll || !this.canSlide) {
        $(this.filterBar).addClass('slide-up');
      } else {
        $(this.filterBar).removeClass('slide-up');
      }
    } else {
      return 0;
    }
    return currentScroll;
  };
  Candidates.prototype.slideFilterBarMobile = function (previousScroll, currentScroll) {
    if (currentScroll < this.table.height() / 2) {
      console.log(this.filterBar);
      if (currentScroll >= previousScroll) {
        $(this.filterBar).addClass('slide-up');
      } else {
        $(this.filterBar).removeClass('slide-up');
      }
    } else {
      return 0;
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
});



//cand profile editing function


$( "#cands-editing-icon" ).click(function() {
    var allInputs=document.getElementsByClassName('inp');
    for( var i=0; i<allInputs.length; i++ ){
        $(allInputs[i]).removeClass('display-none');
        $(allInputs[i]).attr('placeholder' , $(allInputs[i]).prev().text());
    }
    var allTextareas=document.getElementsByTagName('textarea');
    var descriptions=document.getElementsByClassName("exp-description");
    for( i=0; i<allTextareas.length; i++ ){
        $(allTextareas[i]).removeClass('display-none');
        $(allTextareas[i]).text($(descriptions[i]).text().match(/\w+|\d+|-|[()]/gm).join(" ") );

    }
    $(".not-delete").removeClass("display-none");
    var hidden=document.getElementsByClassName('to-be-hidden');
    for( i=0; i<hidden.length; i++ ){
        $(hidden[i]).addClass('display-none');
    }
    $(".skills-editing-input").attr("placeholder","Add skill");


    //described functions for hover. described it here in oder to add it to new skills,
    //which will be created by user
    function mouseOn() {
        if(!($(this).hasClass("not-delete"))) {
            skillName = $(this).text();
            $(this).css("opacity", "0.5").text("Delete");
        }
    }

    function mouseOut() {
        if(!($(this).hasClass("not-delete"))) {
            $(this).css("opacity", "1").text(skillName);
        }
    }

    var skillName;
    $(".skills__elements__decoration").hover(mouseOn,mouseOut);

    $(".skills__elements__decoration").click(function(){
        if(!($(this).hasClass("not-delete"))){
            $(this).remove();
        }});

    $(".add-skill").click(function(){
        $(".skills__elements").prepend("<span class='skills__elements__decoration'></span>");
        $(".skills__elements__decoration:first-child").text($(".skills-editing-input").val());
        $(".skills-editing-input").val("");
        $(".skills__elements__decoration").click(function(){
            if(!($(this).hasClass("not-delete"))){
                $(this).remove();
            }});
        $(".skills__elements__decoration").unbind('mouseenter mouseleave');
        $(".skills__elements__decoration").hover(mouseOn,mouseOut);
    });
    $(".cands__submit").attr("placeholder","");
    $(".cands-exp__editing-button").removeClass("display-none");
    $( ".cands-exp__add-row" ).click(function(){
      var timeLineRow;
      timeLineRow=$(".cands-exp__row").html();
      $(".cands-exp__rows-wrapper").prepend("<div class='cands-exp__row'>"+timeLineRow+"</div>");
      $(".cands-exp__row:first-child textarea").text("");
    });
    $( ".cands-exp__delete-row" ).click(function(){
      $(".cands-exp__row:first-child").remove();
    });
});


