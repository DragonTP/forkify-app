import icons from 'url:../../img/icons.svg';

export default class View {
  _data;
  render(data) {
    if (!data || data.length < 1) return this.renderError()

    this._data = data;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', this._generateMarkup())
  }
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = [...newDOM.querySelectorAll('*')];
    const curElements = [...this._parentEl.querySelectorAll('*')];

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      // Update changed TEXT
      if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '')
        curEl.textContent = newEl.textContent;

      // Update changed ATTRIBUTES
      if (!newEl.isEqualNode(curEl)) {
        [...newEl.attributes].forEach(attr => {
          curEl.setAttribute(attr.name, attr.value)
        })
      }
    })
  }
  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
        <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
        `
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup)
  }
  renderError(message = this._errorMsg, customIcon = this._iconErr || 'icon-alert-triangle') {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#${customIcon}"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup)
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup)
  }
  _clear() {
    this._parentEl.innerHTML = '';
  }
  _generateUser() {
    return `
    <div class="preview__user-generated">
    <svg>
        <use href="${icons}#icon-user"></use>
    </svg>
    </div>
    `
  }
}