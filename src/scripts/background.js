function startMmntmRepost(url) {
  chrome.tabs.create({
    url: "https://app.mmntm.build/write",
  }, (mmntmTab) => {
    chrome.scripting.executeScript({
      target: { tabId: mmntmTab.id },
      func: run,
      args: [url || tab.url]
    });
  });
}

chrome.action.onClicked.addListener(tab => {
  startMmntmRepost();
});

chrome.runtime.onMessage.addListener(request => {
  if (request.cmdName === "repost") {
    startMmntmRepost(request.url);
  }
});

function run(repostLink) {
  const selectors = {
    submitUrlTab: () => document.querySelectorAll('button.tab')?.[1],
    linkInput: () => document.querySelector('input'),
    setLinkButton: () =>  document.querySelector('button[class="mt-4"]'),
  }
  
  const events = {
    click: (element) => element.dispatchEvent(new Event('click')),
    type: (element, text) => {
      const lastValue = element.value;
      element.value = text
      const event = new Event("input", { bubbles: true });
      const tracker = element._valueTracker;
      if (tracker) {
        tracker.setValue(lastValue);
      }
      element.dispatchEvent(event);
    }
  }

  function openSubmitUrlTab() {
    const tab = selectors.submitUrlTab();

    if (!tab) return false;

    events.click(tab);
    
    return true;
  }

  function setTwitterUrl() {
    const input = selectors.linkInput();

    if (!input) return false;

    events.type(input, repostLink);

    return true;
  }

  function clickSetUrl() {
    const setUrlBtn = selectors.setLinkButton();
    
    if (!setUrlBtn) return false;
    
    events.click(setUrlBtn);

    return true;
  }

  const pipeline = [
    () => true,
    openSubmitUrlTab,
    setTwitterUrl,
    clickSetUrl
  ];

  function process() {
    if (!pipeline.length) return;

    const nextStep = pipeline[0];
    const result = nextStep();

    if (result) pipeline.shift();

    setTimeout(process, 100);
  }

  process();
}


