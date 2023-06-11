const VALID_TIME_CLASSES = Object.freeze(['bullet', 'blitz', 'rapid', 'daily']);
const FILTER_SELECT_ID = 'filter-select';
const ANY_OPTION_VALUE = '';

/**
 *
 * @param {array} games - Array of games (objects) returned from API call
 * @param {string} timeCLass - Time class. One of a VALID_TIME_CLASSES
 * @returns {array} - New array filtered by passed time class
 */
const filterGamesByTimeClass = (games, timeCLass) => {
  return games.filter((game) => game.time_class === timeCLass);
};

const generate = () => {
  const filterBoxDOM = document.querySelector('.filter');

  const select = document.createElement('select');
  select.name = 'filter';
  select.id = FILTER_SELECT_ID;
  const optionNodes = [];

  const createOption = (value, text) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = text;
    optionNodes.push(option);
  };

  createOption(ANY_OPTION_VALUE, 'any');

  VALID_TIME_CLASSES.forEach((timeClass) => createOption(timeClass, timeClass));

  select.append(...optionNodes);
  filterBoxDOM.append(select);
};

const reset = () => {
  document.getElementById(FILTER_SELECT_ID).value = ANY_OPTION_VALUE;
};
const disable = () => {
  document.getElementById(FILTER_SELECT_ID).disabled = true;
};
const enable = () => {
  document.getElementById(FILTER_SELECT_ID).disabled = false;
};

const createChangeEventListener = (func) => {
  document.getElementById(FILTER_SELECT_ID).addEventListener('change', func);
};

export const FilterOptions = {
  filterGamesByTimeClass,
  generate,
  reset,
  disable,
  enable,
  createChangeEventListener,
};
