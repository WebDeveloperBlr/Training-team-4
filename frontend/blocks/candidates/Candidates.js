export default new class Notification {
  constructor() {
    this.dataCandidates = '[data-candidates]';
    this.state = {};

    this.fetchData({
      count: 3
    }).then(() => this.render());
    this.initBindings();
  }

  fetchData(options = {}) {
    return $.getJSON('/Training-team-3/assets/json//notifications.json')
      .then(notifications => {
        this.state.notifications = notifications.slice(0, options.count ? options.count : notifications.length);
      })
      .catch(err => console.log(err));
  }

  initBindings() {
    $(document).on('click', '[data-show="candidates"]', (e) => {
      this.fetchData().then(() => this.render());
    });
    $(document).on('click', '[data-close]', (e) => {
      let $currentTarget = $(e.currentTarget);
      $currentTarget.closest('[data-notification]').slideUp();
    });
  }

  render() {
    let candidates = this.state.notifications.map(notification => `
      <div class="notification" data-notification>
            <img class="notification__img" src="https://www.meme-arsenal.com/memes/31b51255d61f1c9ff104146e59a30790.jpg" />
            <span class="notification__name">${notification.lastName} ${notification.name}</span>
            <span class="notification__salary">${notification.salary}</span>
            <span class="notification__position">${notification.position}</span>
            <button class="notification__close" data-close>X</button>
        </div>
    `);

    $(this.dataCandidates).empty().append(candidates);
  }

}