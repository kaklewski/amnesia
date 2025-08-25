import { CUTOFF_DAYS as DEFAULT_DAYS } from './default-values.js';
import { changeElementVisibility, getNumberOfDaysFromInput, isPositiveInteger } from './helpers.js';

const DAYS_KEY = 'days';
const AUTO_CLEAR_KEY = 'autoClearEnabled';
const daysInput = document.getElementById('days-input');
const clearButton = document.getElementById('clear-button');
const autoClearCheckbox = document.getElementById('auto-clear-checkbox');

async function setValuesOnStartup() {
  const { days, autoClearEnabled } = await browser.storage.local.get([DAYS_KEY, AUTO_CLEAR_KEY]);

  daysInput.value = isPositiveInteger(days) ? days : DEFAULT_DAYS;
  autoClearCheckbox.checked = autoClearEnabled === true;
}

async function saveNumberOfDaysInStorage() {
  const days = getNumberOfDaysFromInput(daysInput);
  const errorMessage = document.getElementById('error-message');

  if (!isPositiveInteger(days)) {
    changeElementVisibility(errorMessage, true);
    return;
  }

  changeElementVisibility(errorMessage, false);

  await browser.storage.local.set({ [DAYS_KEY]: days });
}

async function clearHistory() {
  await saveNumberOfDaysInStorage();
  const days = getNumberOfDaysFromInput(daysInput);
  sendClearHistoryMessage(days);
}

async function setAutoClear() {
  const isChecked = autoClearCheckbox.checked;
  await browser.storage.local.set({ [AUTO_CLEAR_KEY]: isChecked });
}

function sendClearHistoryMessage(days) {
  browser.runtime.sendMessage({
    action: 'clearHistory',
    days,
  });
}

document.addEventListener('DOMContentLoaded', setValuesOnStartup);
daysInput.addEventListener('change', saveNumberOfDaysInStorage);
clearButton.addEventListener('click', clearHistory);
autoClearCheckbox.addEventListener('change', setAutoClear);
