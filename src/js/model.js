import { API_URL, RES_PER_PAGE, API_KEY } from './config';
import { AJAX } from './helpers';

export const state = {
    recipe: {},
    search: {
        query: '',
        result: [],
        resultPerPage: RES_PER_PAGE,
        page: 1,
    },
    bookmarks: [],
}

const createRecipeObj = function (data) {
    const { recipe } = data.data;
    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        ...(recipe.key && { key: recipe.key })
    }
}

export const loadRecipe = async function (id) {
    try {
        const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);
        state.recipe = createRecipeObj(data);
        if (state.bookmarks.some(rec => rec.id === id)) state.recipe.bookmarked = true
        else state.recipe.bookmarked = false;
    } catch (err) {
        throw err
    }
}

export const loadSearchResults = async function (query) {
    try {
        state.search.query = query;
        const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
        state.search.result = data.data.recipes.map(rec => {
            return {
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url,
                ...(rec.key && { key: rec.key })
            }
        })
    } catch (err) {
        throw err
    }
}

export const getSearchResultsPage = function (page = state.search.page) {
    state.search.page = page;
    const start = (page - 1) * state.search.resultPerPage;
    const end = page * state.search.resultPerPage;

    return state.search.result.slice(start, end)
}

export const updateServings = function (servings) {
    state.recipe.ingredients.forEach(ing => {
        const ratio = ing.quantity / state.recipe.servings;
        ing.quantity = servings * ratio;
    })
    state.recipe.servings = servings;
}

const persistBookmarks = function () {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks))
}

export const addBookmark = function (recipe) {
    // Add bookmark
    state.bookmarks.push(recipe);

    // Mark current recipe as bookmark
    state.recipe.bookmarked = true;
    persistBookmarks();
}

export const removeBookmark = function (id) {
    const index = state.bookmarks.findIndex(rec => rec.id === id);
    state.bookmarks.splice(index, 1);

    state.recipe.bookmarked = false;
    persistBookmarks();
}

const init = function () {
    const storage = localStorage.getItem('bookmarks');
    if (storage) state.bookmarks = JSON.parse(storage);
}
init()

export const uploadRecipe = async function (newRecipe) {
    try {
        const ingredients = Object.entries(newRecipe).filter(([key, value]) => key.startsWith('ingredient') && value !== '')
            .map(([_, ing]) => {
                const ingArr = ing.split(',').map(el => el.trim());
                if (ingArr.length !== 3) throw new Error('Wrong ingredients format! Please use the correct format');
                const [quantity, unit, description] = ingArr;
                return {
                    quantity: quantity ? +quantity : null,
                    description: description.replace(description[0], description[0].toUpperCase()),
                    unit,
                }
            })

        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients,
        }
        const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
        state.recipe = createRecipeObj(data);
        addBookmark(state.recipe);
    } catch (err) {
        throw err
    }
}

const reset = function () {
    localStorage.clear();
}
// reset()

