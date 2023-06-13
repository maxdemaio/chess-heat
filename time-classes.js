/**
 * An array of valid time classes.
 * @type {string[]}
 */
const VALID_TIME_CLASSES = Object.freeze(['bullet', 'blitz', 'rapid', 'daily']);

/**
 * The ID for the filter select element.
 * @type {string}
 */
const FILTER_SELECT_ID = 'filter-select';

/**
 * The value representing any option.
 * @type {string}
 */
const ANY_OPTION_VALUE = '';

/**
 *
 * @param {array} games - Array of games (objects) returned from API call
 * @param {string} timeCLass - Time class. One of a VALID_TIME_CLASSES
 * @returns {array} - New array filtered by passed time class
 */
function filterGamesByTimeClass(games, timeCLass) {
  return games.filter((game) => game.time_class === timeCLass);
}

/**
 * Generates a select element and appends it to the filter box DOM element.
 */
function generate() {
  /**
   * The DOM element representing the filter box.
   * @type {Element}
   */
  const filterBoxDOM = document.querySelector('.filter');

  /**
   * The select element to be appended to the filter box DOM.
   * @type {HTMLSelectElement}
   */
  const select = document.createElement('select');
  select.name = 'filter';
  select.id = FILTER_SELECT_ID;
  const optionNodes = [];

  /**
   * Creates an option element with the specified value and text content,
   * and pushes it to the optionNodes array.
   * @param {string} value - The value of the option.
   * @param {string} text - The text content of the option.
   */
  function createOption(value, text) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = text;
    optionNodes.push(option);
  }

  createOption(ANY_OPTION_VALUE, 'any');

  VALID_TIME_CLASSES.forEach((timeClass) => createOption(timeClass, timeClass));

  select.append(...optionNodes);
  filterBoxDOM.append(select);
}

function reset() {
  document.getElementById(FILTER_SELECT_ID).value = ANY_OPTION_VALUE;
}
function disable() {
  document.getElementById(FILTER_SELECT_ID).disabled = true;
}
function enable() {
  document.getElementById(FILTER_SELECT_ID).disabled = false;
}

/**
 * Creates a change event listener on the filter select element.
 * @param {function} func - The function to be called when the change event is triggered.
 */
function createChangeEventListener(func) {
  document.getElementById(FILTER_SELECT_ID).addEventListener('change', func);
}

export const FilterOptions = {
  filterGamesByTimeClass,
  generate,
  reset,
  disable,
  enable,
  createChangeEventListener,
};
