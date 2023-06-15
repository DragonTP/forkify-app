import * as model from './model.js';
import { MODEL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime'

const controlRecipe = async function () {
  try {
    const id = location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    // Update results view to mark selected
    resultsView.update(model.getSearchResultsPage());
    // Update bookmarks
    bookmarksView.update(model.state.bookmarks);

    // Loading recipe
    await model.loadRecipe(id);

    // Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError()
  }
};

const controlSearchResults = async function () {
  try {
    // Get search query
    const query = searchView.getQuery();
    if (!query.trim()) return;

    resultsView.renderSpinner();
    // Load serach results
    await model.loadSearchResults(query);

    // Render initial results and pagination buttons
    controlPagination();
  } catch (err) {
    console.error(err)
  }
}

const controlPagination = function (goToPage = 1) {
  // Render new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // Render new pagination buttons
  paginationView.render(model.state.search);
}

const controlServings = function (servings) {
  // Update recipe servings (in state)
  model.updateServings(servings);

  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
}

const controlToggleBookmark = function () {
  !model.state.recipe.bookmarked ? model.addBookmark(model.state.recipe) : model.removeBookmark(model.state.recipe.id)

  recipeView.update(model.state.recipe);

  // Render Bookmark
  bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks)
}

const controlAddRecipe = async function (newRecipe) {
  const awaitTimeout = function () {
    return new Promise(resolve => {
      setTimeout(resolve, MODEL_CLOSE_SEC * 1000)
    })
  }
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();
    // Upload new recipe
    await model.uploadRecipe(newRecipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Render bookmarks
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    
    // Display success message
    addRecipeView.renderMessage();
    // Close form window
    await awaitTimeout();
    addRecipeView.toggleWindow();
  } catch (err) {
    addRecipeView.renderError(err.message);
    await awaitTimeout();
  }
}

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlToggleBookmark)
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe)
}
init();

