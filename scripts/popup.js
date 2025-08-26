import {
  AUTO_CLEAR_ENABLED as DEFAULT_AUTO_CLEAR_ENABLED,
  CUTOFF_DAYS as DEFAULT_DAYS,
  SEND_NOTIFICATIONS_ENABLED as DEFAULT_SEND_NOTIFICATIONS_ENABLED,
} from './default-values.js';
import {
  changeElementVisibility,
  enableTransitions,
  getNumberOfDaysFromInput,
  isPositiveInteger,
} from './helpers.js';

const DAYS_KEY = 'days';
const AUTO_CLEAR_KEY = 'autoClearEnabled';
const SEND_NOTIFICATIONS_KEY = 'sendNotificationsEnabled';
const daysInput = document.getElementById('days-input');
const clearButton = document.getElementById('clear-button');
const autoClearCheckbox = document.getElementById('auto-clear-checkbox');
const sendNotificationsCheckbox = document.getElementById('send-notifications-checkbox');

async function setValuesOnStartup() {
  const { days, autoClearEnabled, sendNotificationsEnabled } = await browser.storage.local.get([
    DAYS_KEY,
    AUTO_CLEAR_KEY,
    SEND_NOTIFICATIONS_KEY,
  ]);

  daysInput.value = isPositiveInteger(days) ? days : DEFAULT_DAYS;
  autoClearCheckbox.checked = autoClearEnabled ?? DEFAULT_AUTO_CLEAR_ENABLED;
  sendNotificationsCheckbox.checked =
    sendNotificationsEnabled ?? DEFAULT_SEND_NOTIFICATIONS_ENABLED;
}

async function saveNumberOfDaysInStorage() {
  const days = getNumberOfDaysFromInput(daysInput);
  const errorAlert = document.getElementById('alert--error');

  if (!isPositiveInteger(days)) {
    changeElementVisibility(errorAlert, true);
    clearButton.disabled = true;
    return;
  }

  changeElementVisibility(errorAlert, false);
  clearButton.disabled = false;

  await browser.storage.local.set({ [DAYS_KEY]: days });
}

async function clearHistory() {
  await saveNumberOfDaysInStorage();
  const days = getNumberOfDaysFromInput(daysInput);
  sendClearHistoryMessage(days);
}

function sendClearHistoryMessage(days) {
  browser.runtime.sendMessage({
    action: 'clearHistory',
    days,
  });
}

async function setAutoClear() {
  const isChecked = autoClearCheckbox.checked;
  await browser.storage.local.set({ [AUTO_CLEAR_KEY]: isChecked });
}

function setSendNotifications() {
  const isChecked = sendNotificationsCheckbox.checked;
  browser.storage.local.set({ [SEND_NOTIFICATIONS_KEY]: isChecked });
}

daysInput.addEventListener('change', saveNumberOfDaysInStorage);
clearButton.addEventListener('click', clearHistory);
autoClearCheckbox.addEventListener('change', setAutoClear);
sendNotificationsCheckbox.addEventListener('change', setSendNotifications);

document.addEventListener('DOMContentLoaded', async () => {
  await setValuesOnStartup();
  enableTransitions();
});

browser.runtime.onMessage.addListener((message) => {
  if (message.action === 'showSuccessAlert') {
    const successAlert = document.getElementById('alert--success');
    changeElementVisibility(successAlert, true);
  }
});
