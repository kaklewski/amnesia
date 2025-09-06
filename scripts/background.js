import { DEFAULTS, KEYS } from './config.js';
import { getCutoff } from './helpers.js';

let isClearing = false;

async function clearHistory(cutoff) {
  await browser.history.deleteRange({
    startTime: 0,
    endTime: cutoff,
  });
}

async function showNotification(message) {
  const { showNotificationsEnabled } = await browser.storage.local.get([
    KEYS.SHOW_NOTIFICATIONS,
  ]);
  const enabled = showNotificationsEnabled ?? DEFAULTS.SHOW_NOTIFICATIONS;

  if (browser.notifications && enabled) {
    browser.notifications.create('amnesia-notification', {
      type: 'basic',
      title: 'Amnesia',
      message,
    });
  } else {
    browser.runtime.sendMessage({
      action: 'showSuccessAlert',
      message,
    });
  }
}

async function clearHistoryWithNotification(days) {
  // Avoid flashing the overlay for very short operations
  const showClearingOverlayTimeout = setTimeout(() => {
    isClearing = true;
    browser.runtime.sendMessage({ action: 'clearingStarted' });
  }, 150);

  try {
    await clearHistory(getCutoff(days));
    const notificationText = browser.i18n.getMessage(
      'historyCleared',
      days.toString(),
    );
    await showNotification(notificationText);
  } finally {
    clearTimeout(showClearingOverlayTimeout);
    isClearing = false;
    browser.runtime.sendMessage({ action: 'clearingFinished' });
  }
}

async function onBrowserStartup() {
  const { days, autoClearEnabled } = await browser.storage.local.get([
    KEYS.DAYS,
    KEYS.AUTO_CLEAR,
  ]);
  const effectiveDays = days ?? DEFAULTS.DAYS;
  const enabled = autoClearEnabled ?? DEFAULTS.AUTO_CLEAR;

  if (!enabled) return;

  await clearHistoryWithNotification(effectiveDays);
}

async function onRuntimeMessage(message) {
  switch (message.action) {
    case 'clearHistory':
      await clearHistoryWithNotification(message.days);
      break;
    case 'getClearingState':
      return Promise.resolve({ isClearing });
    default:
      break;
  }
}

browser.runtime.onStartup.addListener(onBrowserStartup);
browser.runtime.onMessage.addListener(onRuntimeMessage);
