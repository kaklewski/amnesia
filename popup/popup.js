const DEFAULT_DAYS = 30;
const STORAGE_KEY = 'lastDays';
const daysInput = document.getElementById('daysInput');
const cleanButton = document.getElementById('cleanBtn');
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

async function saveDaysToStorage(days) {
  await browser.storage.local.set({ [STORAGE_KEY]: days });
}

function sendCleanHistoryMessage(days) {
  browser.runtime.sendMessage({
    action: 'cleanHistory',
    numberOfDays: days,
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const { lastDays } = await browser.storage.local.get(STORAGE_KEY);
  daysInput.value = isPositiveInteger(lastDays) ? lastDays : DEFAULT_DAYS;
});

cleanButton.addEventListener('click', async () => {
  const days = parseInt(daysInput.value, 10);

  if (!isPositiveInteger(days)) {
    showError();
    return;
  }

  hideError();

  await saveDaysToStorage(days);
  sendCleanHistoryMessage(days);
});
