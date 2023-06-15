class SearchView {
    _parentEl = document.querySelector('.search');
    
    _clearInputAndBlur() {
        this._parentEl.elements.search.value = '';
        this._parentEl.elements.search.blur();
    }
    
    addHandlerSearch(handler) {
        this._parentEl.addEventListener('submit', function(e) {
            e.preventDefault();
            handler();
        })
    }

    getQuery() {
        const query = this._parentEl.elements.search.value;
        this._clearInputAndBlur();
        return query;
    }
}

export default new SearchView();