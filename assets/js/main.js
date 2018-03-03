$(document).ready(function () {

  function ProfileBuilder(elem) {
    this.photoContainer = elem;
    this.photoInput = document.getElementById('photo');
    this.previewBlock = $(this.photoContainer).find('#profilePreview');
    this.previewText = $(this.photoContainer).find('#createProfile__filename-preview');

    this.bindEvents();
  }

  function HrAppBuilder(elem) {
    this.hrAppSection = elem;
    this.sidebar = $(this.hrAppSection).find('.hr-app-section__sidebar');
    if ($(this.hrAppSection.find('#vacancies-block')).length > 0) {
      new Vacancies(this.hrAppSection.find('#vacancies-block'));
    }
    if (window.matchMedia('(max-width: 515px)').matches) {
      this.toggleButton = $(this.hrAppSection).find('.icon-HAMBURGER');
      this.crossButton = $(this.sidebar).find('.icon-CLOSE');

      this.bindMobileEvents();
    } else {
      this.bindEvents();
    }
  }

  ProfileBuilder.prototype.bindEvents = function () {
    var self = this;

    if (this.photoInput) {
      $(this.photoInput).change(function (event) {
        event.preventDefault();
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

  function Vacancies(element) {
    this.section = element;
    this.filterBar = this.section.find('.vacancies-block__hr-app__filters-bar');
    this.vacancies = [];
    this.table = $(this.section).find('#vacancies-block__table');
    this.numbVacancies = +($(this.section).find("#rows-per-page-vacancies option:selected").text());

    if (window.matchMedia('(max-width: 515px)').matches) {
      this.canSlide = true;
      this.collapseElems = $(this.section).find('[data-toggle="collapse"]');
      this.fillTable();
    } else {
      this.fillTable();
      this.bindEvents();
    }
  }

  Vacancies.prototype.fillTable = function () {
    var self = this;
    (function () {
      var URL = "assets/json/vacancies.json";
      $.getJSON(URL, {
        tags: "mount rainier",
        tagmode: "any",
        format: "json"
      })
        .done(function (data) {
          if (self.collapseElems) {
            self.getMobileTable(data);
          } else {
            self.getTable(data);
          }
          if (window.matchMedia('(max-width: 515px)').matches) {
            self.tableCollapseElems = $(self.table).find('[data-toggle="collapse"]');
            self.bindMobileEvents();
          }
        });
    })();


  };


  Vacancies.prototype.getTable = function (data) {
    var self = this;
    self.vacancies = data;
    var row;
    for (var i = 0; i < self.numbVacancies; i++) {
      row = '<div class="vacancies-block__table__row table--row table-row--big">\n';
      for (var key in self.vacancies[i]) {
        switch (key) {
          case "position":
            row += '<div class="vacancies-block__table-col" data-toggle="collapse" data-target="#vacancies-block__table__xs-cols-wrap-"ad role="button" aria-expanded="false" aria-controls="filters-bar-collapse"><div class="vacancies-block__table-col__profession">' + self.vacancies[i][key] + '</div><svg class="icon icon-ARROW "><use xlink:href="assets/images/svg/symbol/sprite.svg#ARROW"></use></svg></div>';
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
    for (var i = 0; i < self.numbVacancies; i++) {
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
    if (currentScroll > previousScroll || currentScroll !== 0) {
      $(this.filterBar).addClass('slide-up');
    } else {
      $(this.filterBar).removeClass('slide-up');
    }
    return previousScroll = currentScroll;
  };
  Vacancies.prototype.slideFilterBarMobile = function (previousScroll, currentScroll) {
    console.log(previousScroll + " " + currentScroll);
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
  if (hrAppWrapper.length > 0) {
    new HrAppBuilder(hrAppWrapper);
  }

  var createProfileWrapper = $(document).find(".createProfile__edit-block");
  if (createProfileWrapper.length > 0) {
    new ProfileBuilder(createProfileWrapper);
  }
});




