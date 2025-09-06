import { DEFAULTS, KEYS } from './config.js';
import {
  changeElementVisibility,
  enableTransitions,
  getNumberOfDaysFromInput,
  isPositiveInteger,
  toKebabCase,
} from './helpers.js';

const elements = {
  clearingOverlay: document.getElementById('clearing-overlay'),
  clearingOverlayText: document.getElementById('clearing-overlay-text'),
  daysInput: document.getElementById('days-input'),
  clearButton: document.getElementById('clear-button'),
  autoClearCheckbox: document.getElementById('auto-clear-checkbox'),
  showNotificationsCheckbox: document.getElementById(
    'show-notifications-checkbox',
  ),
  errorAlert: document.getElementById('error-alert'),
  successAlert: document.getElementById('success-alert'),
};

function applyI18n() {
  document.documentElement.lang = browser.i18n.getUILanguage();
  document.title = browser.i18n.getMessage('extensionName');

  // Keys correspond to messages in _locales/*/messages.json
  const keys = [
    'daysInputLabel',
    'clearButton',
    'errorAlertText',
    'successAlertText',
    'autoClearCheckboxLabel',
    'showNotificationsCheckboxLabel',
    'clearingOverlayText',
  ];

  keys.forEach((key) => {
    const id = toKebabCase(key);
    const element = document.getElementById(id);
    const messageValue = browser.i18n.getMessage(key);
    if (!element || !messageValue) return;

    element.tagName === 'button'
      ? (element.value = messageValue)
      : (element.textContent = messageValue);
  });
}

async function setValuesOnStartup() {
  const {
    days = DEFAULTS.DAYS,
    autoClearEnabled = DEFAULTS.AUTO_CLEAR,
    showNotificationsEnabled = DEFAULTS.SHOW_NOTIFICATIONS,
  } = await browser.storage.local.get([
    KEYS.DAYS,
    KEYS.AUTO_CLEAR,
    KEYS.SHOW_NOTIFICATIONS,
  ]);

  elements.daysInput.value = isPositiveInteger(days) ? days : DEFAULTS.DAYS;
  elements.autoClearCheckbox.checked = autoClearEnabled;
  elements.showNotificationsCheckbox.checked = showNotificationsEnabled;
}

function showAlert(type, visible) {
  changeElementVisibility(elements[`${type}Alert`], visible);
}

async function handleDaysChange() {
  const days = getNumberOfDaysFromInput(elements.daysInput);

  if (!isPositiveInteger(days)) {
    showAlert('error', true);
    elements.clearButton.disabled = true;
    return;
  }

  showAlert('error', false);
  elements.clearButton.disabled = false;
  await browser.storage.local.set({ [KEYS.DAYS]: days });
}

async function requestHistoryClear() {
  const days = getNumberOfDaysFromInput(elements.daysInput);

  browser.runtime.sendMessage({
    action: 'clearHistory',
    days,
  });
}

async function setCheckboxPreference(key, checkbox) {
  await browser.storage.local.set({ [key]: checkbox.checked });
}

async function onContentLoaded() {
  applyI18n();
  await setValuesOnStartup();
  enableTransitions();

  const { isClearing } = await browser.runtime.sendMessage({
    action: 'getClearingState',
  });
  changeElementVisibility(elements.clearingOverlay, isClearing);
}

function onBackgroundMessage(message) {
  switch (message.action) {
    case 'showSuccessAlert':
      showAlert('success', true);
      setTimeout(() => {
        showAlert('success', false);
      }, 3000);
      break;
    case 'clearingStarted':
      changeElementVisibility(elements.clearingOverlay, true);
      break;
    case 'clearingFinished':
      changeElementVisibility(elements.clearingOverlay, false);
      break;
    default:
      break;
  }
}

elements.daysInput.addEventListener('change', handleDaysChange);
elements.clearButton.addEventListener('click', requestHistoryClear);
elements.autoClearCheckbox.addEventListener('change', () =>
  setCheckboxPreference(KEYS.AUTO_CLEAR, elements.autoClearCheckbox),
);
elements.showNotificationsCheckbox.addEventListener('change', () =>
  setCheckboxPreference(
    KEYS.SHOW_NOTIFICATIONS,
    elements.showNotificationsCheckbox,
  ),
);
document.addEventListener('DOMContentLoaded', onContentLoaded);
browser.runtime.onMessage.addListener(onBackgroundMessage);
