export default new class Menu {
  constructor() {
    this.initBindings();
  }

  initBindings() {
    $(document).on('click', '[data-btn-menu]', (e) => $('[data-menu]').toggleClass('_active'));
  }
}