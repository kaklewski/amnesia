browser.runtime.onMessage.addListener(async (message) => {
  if (message.action === 'cleanHistory') {
    const timeCutoff = Date.now() - message.numberOfDays * 24 * 60 * 60 * 1000;
    // const timeCutoff = Date.now() - message.numberOfDays * 60 * 60 * 1000; // test (default to hours)
    const notificationMessage = `Usunięto historię starszą niż ${message.numberOfDays} dni`;

    await clearHistory(timeCutoff);
    notify(notificationMessage);
  }
});

async function clearHistory(cutoff) {
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
