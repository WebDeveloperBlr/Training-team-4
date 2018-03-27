export default new class Notification {
  constructor() {
    this.dataNotifications = '[data-notifications]';
    this.state = {};

    this.fetchData({
      count: 3
    }).then(() => this.render());
    this.initBindings();
  }

  fetchData(options = {}) {
    return $.getJSON('/Training-team-3/assets/json/notifications.json')
      .then(notifications => {
        this.state.notifications = this.sortByDate(notifications).slice(0, options.count ? options.count : notifications.length);
      })
      .catch(err => console.log(err));
  }

  sortByDate(notifications) {
    return notifications
      .filter(notification => {
        let today = new Date();
        today.setHours(0, 0, 0, 0);
        return new Date(notification.start).getTime() >= today.getTime()
      })
      .sort((current, next) => new Date(current.start) - new Date(next.start).getTime())
  }

  initBindings() {
    $(document).on('click', '[data-show="notifications"]', (e) => {
      this.fetchData().then(() => this.render());
    });
    $(document).on('click', '[data-close]', (e) => {
      let $currentTarget = $(e.currentTarget);
      $currentTarget.closest('[data-notification]').slideUp();
    });
  }

  render() {
    let notifications = this.state.notifications.map(notification => `
      <div class="notification" data-notification>
        <span class="notification__title">${notification.title}</span>
        <span class="notification__start">${notification.start} ${notification.end}</span>
        <button class="notification__close" data-close>X</button>
        </div>
    `);

    $(this.dataNotifications).empty().append(notifications);
  }

}