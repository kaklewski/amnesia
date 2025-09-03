import {
  AUTO_CLEAR_ENABLED as DEFAULT_AUTO_CLEAR_ENABLED,
  CUTOFF_DAYS as DEFAULT_DAYS,
  SHOW_NOTIFICATIONS_ENABLED as DEFAULT_SHOW_NOTIFICATIONS_ENABLED,
} from './default-values.js';
import { getCutoff } from './helpers.js';

async function clearHistory(cutoff) {
  await browser.history.deleteRange({
    startTime: 0,
    endTime: cutoff,
  });
}

async function showNotification(message) {
  const { showNotificationsEnabled } = await browser.storage.local.get([
    'showNotificationsEnabled',
  ]);
  const enabled = showNotificationsEnabled ?? DEFAULT_SHOW_NOTIFICATIONS_ENABLED;

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
  await clearHistory(getCutoff(days));
  const notificationText = browser.i18n.getMessage('historyCleared', days.toString());
  showNotification(notificationText);
}

async function onBrowserStartup() {
  const { days, autoClearEnabled } = await browser.storage.local.get(['days', 'autoClearEnabled']);
  const effectiveDays = days ?? DEFAULT_DAYS;
  const enabled = autoClearEnabled ?? DEFAULT_AUTO_CLEAR_ENABLED;

  if (!enabled) return;

  await clearHistoryWithNotification(effectiveDays);
}

async function onRuntimeMessage(message) {
  if (message.action === 'clearHistory') {
    await clearHistoryWithNotification(message.days);
  }
}

browser.runtime.onStartup.addListener(onBrowserStartup);
browser.runtime.onMessage.addListener(onRuntimeMessage);
