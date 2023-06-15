import View from './View.js';

class ResultsView extends View {
    _parentEl = document.querySelector('.results');
    _errorMsg = 'No recipes found for your query! Please try again'

    _generateMarkup() {
        const id = location.hash.slice(1);
        return this._data.map(data => {
            return `
            <li class="preview">
                <a class="preview__link ${data.id === id ? 'preview__link--active' : ''}" href="#${data.id}">
                <figure class="preview__fig">
                    <img src="${data.image}" alt="${data.title}" />
                </figure>
                <div class="preview__data">
                    <h4 class="preview__title">${data.title}</h4>
                    <p class="preview__publisher">${data.publisher}</p>
                    ${data.key ? this._generateUser() : ''}
                </div>
                </a>
            </li>
            `
        }).join('')
    }
}

export default new ResultsView();