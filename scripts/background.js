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

async function notify(message) {
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

async function runAutoClear() {
  const { days, autoClearEnabled } = await browser.storage.local.get(['days', 'autoClearEnabled']);
  const effectiveDays = days ?? DEFAULT_DAYS;
  const enabled = autoClearEnabled ?? DEFAULT_AUTO_CLEAR_ENABLED;

  if (!enabled) return;

  await clearHistory(getCutoff(effectiveDays));
  notify(`History older than ${effectiveDays} days has been deleted.`);
}

browser.runtime.onMessage.addListener(async (message) => {
  if (message.action === 'clearHistory') {
    await clearHistory(getCutoff(message.days));
    notify(`History older than ${message.days} days has been deleted.`);
  }
});

browser.runtime.onStartup.addListener(runAutoClear);
