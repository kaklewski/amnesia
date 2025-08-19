import { CUTOFF_DAYS as DEFAULT_DAYS } from './default-values.js';
import { changeElementVisibility, getNumberOfDaysFromInput, isPositiveInteger } from './helpers.js';

const DAYS_KEY = 'days';
const AUTO_CLEAN_KEY = 'autoCleanEnabled';
const daysInput = document.getElementById('daysInput');
const cleanButton = document.getElementById('cleanBtn');
const autoCleanCheckbox = document.getElementById('autoCleanCheckbox');

async function setValuesOnStartup() {
  const { days, autoCleanEnabled } = await browser.storage.local.get([DAYS_KEY, AUTO_CLEAN_KEY]);

  daysInput.value = isPositiveInteger(days) ? days : DEFAULT_DAYS;
  autoCleanCheckbox.checked = autoCleanEnabled === true;
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

async function cleanHistory() {
  await saveNumberOfDaysInStorage();
  const days = getNumberOfDaysFromInput(daysInput);
  sendCleanHistoryMessage(days);
}

async function setAutoClean() {
  const isChecked = autoCleanCheckbox.checked;
  await browser.storage.local.set({ [AUTO_CLEAN_KEY]: isChecked });
}

function sendCleanHistoryMessage(days) {
  browser.runtime.sendMessage({
    action: 'cleanHistory',
    days,
  });
}

document.addEventListener('DOMContentLoaded', setValuesOnStartup);
daysInput.addEventListener('change', saveNumberOfDaysInStorage);
cleanButton.addEventListener('click', cleanHistory);
autoCleanCheckbox.addEventListener('change', setAutoClean);
