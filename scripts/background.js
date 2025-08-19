import {
  AUTO_CLEAN_ENABLED as DEFAULT_AUTO_CLEAN_ENABLED,
  CUTOFF_DAYS as DEFAULT_DAYS,
} from './default-values.js';

async function runAutoClean() {
  const { days, autoCleanEnabled } = await browser.storage.local.get(['days', 'autoCleanEnabled']);
  const effectiveDays = days ?? DEFAULT_DAYS;
  const effectiveAutoCleanEnabled = autoCleanEnabled ?? DEFAULT_AUTO_CLEAN_ENABLED;

  if (!effectiveAutoCleanEnabled) return;

  const cutoff = Date.now() - effectiveDays * 24 * 60 * 60 * 1000;
  await cleanHistory(cutoff);
  notify(`History older than ${effectiveDays} days has been deleted.`);
}

async function cleanHistory(cutoff) {
  const results = await browser.history.search({
    text: '',
    startTime: 0,
    endTime: cutoff,
    maxResults: 100000,
  });

  for (let item of results) {
    await browser.history.deleteUrl({ url: item.url });
  }
}

function notify(message) {
  if (browser.notifications) {
    browser.notifications.create({
      type: 'basic',
      iconUrl: 'icon.png',
      title: 'Amnesia',
      message,
    });
  } else {
    console.log(message);
  }
}

browser.runtime.onStartup.addListener(runAutoClean);

browser.runtime.onMessage.addListener(async (message) => {
  if (message.action === 'cleanHistory') {
    const cutoff = Date.now() - message.days * 24 * 60 * 60 * 1000;
    // const cutoff = Date.now() - message.days * 60 * 60 * 1000; // test (default to hours)

    await cleanHistory(cutoff);
    notify(`History older than ${message.days} days has been deleted.`);
  }
});
