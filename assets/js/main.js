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
    this.hrAppSection = elem;
    this.sidebar = $(this.hrAppSection).find('.hr-app-section__sidebar');

    //if we on page vacancies we initializing vacancies object which described below
    if ($(this.hrAppSection.find('#vacancies-block')).length > 0) {
      new Vacancies(this.hrAppSection.find('#vacancies-block'));
    }

    //if we're working on smart-phone, initialize some special variables and bind mobile events
    if (window.matchMedia('(max-width: 515px)').matches) {
      this.toggleButton = $(this.hrAppSection).find('.icon-HAMBURGER');
      this.crossButton = $(this.sidebar).find('.icon-CLOSE');

      this.bindMobileEvents();
    } else {
      //else bind desktop events
      this.bindEvents();
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

  //object vacancies -- all, what we're doing in this section described there
  function Vacancies(element) {
    //DOM elements
    this.section = element;
    this.filterBar = this.section.find('.vacancies-block__hr-app__filters-bar');
    this.vacancies = [];
    this.table = $(this.section).find('#vacancies-block__table');
    this.itemsCountSelect = $(this.table).find('#rows-per-page-vacancies');
    this.pagination = $(this.section).find('#pagination');
    this.itemsPerPage = +($(this.section).find("#rows-per-page-vacancies option:selected").text());
    this.itemsInformation = $(this.table).find('.vacancies-block__table-editor__pagination');

    //Data - our data which will be in the table
    this.data = [];
    //defaultOptions - it's options for pagination
    this.defaultOptions = {};
    //async initializing data and creating pagination
    this.getData();

    //mobile branch
    if (window.matchMedia('(max-width: 515px)').matches) {
      //this is for sliding filter-panel
      this.canSlide = true;
      this.collapseElems = $(this.section).find('[data-toggle="collapse"]');
    } else {
      //not mobile events
      this.bindEvents();
    }
    //common events
    this.bindCommonEvents();
  }

  //change label text like '1-30 of 60' on table-editor
  Vacancies.prototype.addItemInformation = function (length, page) {
    var lastItem;
    if(this.itemsPerPage * page>length){
      lastItem = length;
    }else{
      lastItem = this.itemsPerPage * page;
    }
    this.itemsInformation.html((this.itemsPerPage * (page - 1) + 1) + ' - ' + lastItem + ' of ' + length);
  };

  //clear the table
  Vacancies.prototype.clear = function (element) {
    $(element).each(function (index, el) {
      el.remove();
    })
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
        self.clear(self.table.find('.vacancies-block__table__row'));
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
          var currentPage = self.pagination.twbsPagination('getCurrentPage');
          self.setPaginationOptions(currentPage);
          self.pagination.twbsPagination('destroy');
          self.pagination.twbsPagination(self.defaultOptions);
        });
    })();
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


  Vacancies.prototype.getTable = function (data) {
    var self = this;
    self.vacancies = data;
    var row;
    for (var i = 0; i < data.length; i++) {
      row = '<div class="vacancies-block__table__row table--row table-row--big">\n';
      for (var key in self.vacancies[i]) {
        switch (key) {
          case "position":
            row += '<div class="vacancies-block__table-col" data-toggle="collapse" data-target="#vacancies-block__table__xs-cols-wrap-" addrole="button" aria-expanded="false" aria-controls="filters-bar-collapse"><div class="vacancies-block__table-col__profession">' + self.vacancies[i][key] + '</div><svg class="icon icon-ARROW "><use xlink:href="assets/images/svg/symbol/sprite.svg#ARROW"></use></svg></div>';
            break;
          case "viewСandidates":
            row += '<div class="vacancies-block__table-col"><a class="vacancies-block__table-col__button" href="#">' + self.vacancies[i][key] + '</a></div>';
            break;
          default:
            row += '<div class="vacancies-block__table-col"><div class="vacancies-block__table-col__advantages">' + self.vacancies[i][key] + '</div></div>';
        }
      }
      $(self.table).append(row);
    }
  };

  Vacancies.prototype.getMobileTable = function (data) {
    var self = this;
    self.vacancies = data;
    var row;
    var mobileHeaders = ['Status', 'Salary'];
    for (var i = 0; i < data.length; i++) {
      row = '<div class="vacancies-block__table__row table--row table-row--big">\n';
      var j = 0;
      for (var key in self.vacancies[i]) {
        if (j === 0) {
          row += '<div class="vacancies-block__table-col" data-toggle="collapse" data-target="#vacancies-block__table__xs-cols-wrap-' + i + '"addrole="button" aria-expanded="false" aria-controls="filters-bar-collapse"><div class="vacancies-block__table-col__profession">' + self.vacancies[i][key] + '</div><svg class="icon icon-ARROW "><use xlink:href="assets/images/svg/symbol/sprite.svg#ARROW"></use></svg></div><div class="vacancies-block__table__xs-cols-wrap collapse" style="width: 100%;" data-parent="#vacancies-block__table" id="vacancies-block__table__xs-cols-wrap-' + i + '">';
        } else if (j === Object.keys(self.vacancies[i]).length - 1) {
          row += '<div class="vacancies-block__table-col"><a class="vacancies-block__table-col__button" href="#">' + self.vacancies[i][key] + '</a></div></div>';
        } else {
          row += '<div class="vacancies-block__mobile-table-col-header">' + mobileHeaders[j - 1] + '</div>';
          row += '<div class="vacancies-block__table-col"><div class="vacancies-block__table-col__advantages">' + self.vacancies[i][key] + '</div></div>';
        }
        j++;
      }
      $(self.table).append(row);
    }

    $(self.collapseElems).each(function (index, el) {
      self.addCollapse(el, $(el).next());
    });

    $('.vacancies-block__table-editor__text').html('Rows');
  };

  // add collapse attributes to mobile elements
  Vacancies.prototype.addCollapse = function addCollapse(elem, target) {
    var collapseTarget = ($(target).attr("id")) ? "#" + $(target).attr("id") : "." + $(target).attr("class");
    $(target).addClass("collapse");
    $(elem).attr("data-target", collapseTarget);
    $(elem).attr("aria-controls", collapseTarget.slice(1));
  };
  HrAppBuilder.prototype.bindEvents = function () {

  };
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

  Vacancies.prototype.sortTable = function (n) {
    var rows, switching, i, x, y, shouldSwitch, switchcount = 0;
    var textCurItem, textNextItem;
    var dir = "asc";
    switching = true;

    while (switching) {
      switching = false;
      rows = $('.vacancies-block__table__row');

      for (i = 0; i < (rows.length - 1); i++) {

        shouldSwitch = false;// Start by saying there should be no switching:
        /* Get the two elements you want to compare,
        one from current row and one from the next: */

        x = ($(".vacancies-block__table-col", rows[i]))[n];
        y = ($(".vacancies-block__table-col", rows[i + 1]))[n];

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

        if (switchcount == 0 && dir === "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
  };
  Vacancies.prototype.bindMobileEvents = function () {
    var self = this;
    $(self.tableCollapseElems.next()).on('show.bs.collapse', function () {
      $(this).prev().find('.icon-ARROW').addClass('rotate270');
      $(self.filterSection).addClass('slide-up');
      self.canSlide = false;
    });
    $(self.tableCollapseElems.next()).on('hide.bs.collapse', function (e) {
      $(this).prev().find('.icon-ARROW').removeClass('rotate270');
      self.canSlide = true;
    });

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




