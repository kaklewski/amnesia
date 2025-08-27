import {
  AUTO_CLEAR_ENABLED as DEFAULT_AUTO_CLEAR_ENABLED,
  CUTOFF_DAYS as DEFAULT_DAYS,
  SHOW_NOTIFICATIONS_ENABLED as DEFAULT_SHOW_NOTIFICATIONS_ENABLED,
} from './default-values.js';
import {
  changeElementVisibility,
  enableTransitions,
  getNumberOfDaysFromInput,
  isPositiveInteger,
  toKebabCase,
} from './helpers.js';

const DAYS_KEY = 'days';
const AUTO_CLEAR_KEY = 'autoClearEnabled';
const SHOW_NOTIFICATIONS_KEY = 'showNotificationsEnabled';
const daysInput = document.getElementById('days-input');
const clearButton = document.getElementById('clear-button');
const autoClearCheckbox = document.getElementById('auto-clear-checkbox');
const showNotificationsCheckbox = document.getElementById('show-notifications-checkbox');

function applyI18nMessages() {
  // Keys correspond to message names in _locales/*/messages.json
  const keys = [
    'daysInputLabel',
    'clearButton',
    'errorAlertText',
    'successAlertText',
    'autoClearCheckboxLabel',
    'showNotificationsCheckboxLabel',
  ];

  keys.forEach((key) => {
    const messageValue = browser.i18n.getMessage(key);
    if (!messageValue) return;

    const id = toKebabCase(key);
    const element = document.getElementById(id);

    if (element) {
      if (element.tagName === 'button') {
        element.value = messageValue;
      } else {
        element.textContent = messageValue;
      }
    }
  });
}

async function setValuesOnStartup() {
  const { days, autoClearEnabled, showNotificationsEnabled } = await browser.storage.local.get([
    DAYS_KEY,
    AUTO_CLEAR_KEY,
    SHOW_NOTIFICATIONS_KEY,
  ]);

  daysInput.value = isPositiveInteger(days) ? days : DEFAULT_DAYS;
  autoClearCheckbox.checked = autoClearEnabled ?? DEFAULT_AUTO_CLEAR_ENABLED;
  showNotificationsCheckbox.checked =
    showNotificationsEnabled ?? DEFAULT_SHOW_NOTIFICATIONS_ENABLED;
}

async function saveNumberOfDaysInStorage() {
  const days = getNumberOfDaysFromInput(daysInput);
  const errorAlert = document.getElementById('error-alert');

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

function setshowNotifications() {
  const isChecked = showNotificationsCheckbox.checked;
  browser.storage.local.set({ [SHOW_NOTIFICATIONS_KEY]: isChecked });
}

daysInput.addEventListener('change', saveNumberOfDaysInStorage);
clearButton.addEventListener('click', clearHistory);
autoClearCheckbox.addEventListener('change', setAutoClear);
showNotificationsCheckbox.addEventListener('change', setshowNotifications);

document.addEventListener('DOMContentLoaded', async () => {
  applyI18nMessages();
  await setValuesOnStartup();
  enableTransitions();
});

browser.runtime.onMessage.addListener((message) => {
  if (message.action === 'showSuccessAlert') {
    const successAlert = document.getElementById('success-alert');
    changeElementVisibility(successAlert, true);
    setTimeout(() => {
      changeElementVisibility(successAlert, false);
    }, 3000);
  }
});
