import { CUTOFF_DAYS as DEFAULT_DAYS } from './default-values.js';
import { changeElementVisibility, getNumberOfDaysFromInput, isPositiveInteger } from './helpers.js';

const DAYS_KEY = 'days';
const AUTO_CLEAR_KEY = 'autoClearEnabled';
const daysInput = document.getElementById('daysInput');
const clearButton = document.getElementById('clearBtn');
const autoClearCheckbox = document.getElementById('autoClearCheckbox');

async function setValuesOnStartup() {
  const { days, autoClearEnabled } = await browser.storage.local.get([DAYS_KEY, AUTO_CLEAR_KEY]);

  daysInput.value = isPositiveInteger(days) ? days : DEFAULT_DAYS;
  autoClearCheckbox.checked = autoClearEnabled === true;
}

async function saveNumberOfDaysInStorage() {
  const days = getNumberOfDaysFromInput(daysInput);
  const errorLabel = document.getElementById('errorMessage');

  if (!isPositiveInteger(days)) {
    changeElementVisibility(errorLabel, true);
    return;
  }

  changeElementVisibility(errorLabel, false);

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
