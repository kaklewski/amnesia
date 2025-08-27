function isPositiveInteger(value) {
  const number = parseInt(value, 10);
  return Number.isInteger(number) && number > 0;
}

function changeElementVisibility(element, visibility) {
  element.dataset.visible = `${visibility}`;
}

function getNumberOfDaysFromInput(input) {
  return parseInt(input.value, 10);
}

function enableTransitions() {
  setTimeout(() => {
    document.getElementsByTagName('body')[0].dataset.showTransitions = 'true';
  }, 100);
}

function toKebabCase(string) {
  return string.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

export {
  changeElementVisibility,
  enableTransitions,
  getNumberOfDaysFromInput,
  isPositiveInteger,
  toKebabCase,
};
