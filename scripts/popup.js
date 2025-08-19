import { CUTOFF_DAYS as DEFAULT_DAYS } from './default-values.js';
const DAYS_KEY = 'days';
const AUTO_CLEAN_KEY = 'autoCleanEnabled';
const daysInput = document.getElementById('daysInput');
const cleanButton = document.getElementById('cleanBtn');
const autoCleanCheckbox = document.getElementById('autoCleanCheckbox');
const errorLabel = document.getElementById('errorMessage');

function isPositiveInteger(value) {
  const number = parseInt(value, 10);
  return Number.isInteger(number) && number > 0;
}

function showError() {
  errorLabel.classList.remove('hidden');
}

function hideError() {
  errorLabel.classList.add('hidden');
}

async function saveDaysToStorage() {
  const days = parseInt(daysInput.value, 10);

  if (!isPositiveInteger(days)) {
    showError();
    return;
  }

  hideError();

  await browser.storage.local.set({ [DAYS_KEY]: days });
}

function sendCleanHistoryMessage(days) {
  browser.runtime.sendMessage({
    action: 'cleanHistory',
    days,
  });
}

async function setAutoClean() {
  const isChecked = autoCleanCheckbox.checked;
  await browser.storage.local.set({ [AUTO_CLEAN_KEY]: isChecked });
}

async function setInputValues() {
  const { days, autoCleanEnabled } = await browser.storage.local.get([DAYS_KEY, AUTO_CLEAN_KEY]);

  daysInput.value = isPositiveInteger(days) ? days : DEFAULT_DAYS;
  autoCleanCheckbox.checked = autoCleanEnabled === true;
}

document.addEventListener('DOMContentLoaded', setInputValues);
autoCleanCheckbox.addEventListener('change', setAutoClean);
daysInput.addEventListener('change', saveDaysToStorage);

cleanButton.addEventListener('click', async () => {
  await saveDaysToStorage();
  const days = parseInt(daysInput.value, 10);
  sendCleanHistoryMessage(days);
});
