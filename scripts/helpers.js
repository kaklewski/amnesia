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

export { changeElementVisibility, getNumberOfDaysFromInput, isPositiveInteger };
