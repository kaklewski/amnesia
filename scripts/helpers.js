function changeElementVisibility(element, visibility) {
  element.dataset.visible = `${visibility}`;
}

function enableTransitions() {
  setTimeout(() => {
    document.getElementsByTagName('body')[0].dataset.showTransitions = 'true';
  }, 100);
}

function getCutoff(days) {
  return Date.now() - days * 24 * 60 * 60 * 1000;
}

function getNumberOfDaysFromInput(input) {
  return parseInt(input.value, 10);
}

function isPositiveInteger(value) {
  const number = parseInt(value, 10);
  return Number.isInteger(number) && number > 0;
}

function toKebabCase(string) {
  return string.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

export {
  changeElementVisibility,
  enableTransitions,
  getCutoff,
  getNumberOfDaysFromInput,
  isPositiveInteger,
  toKebabCase,
};
