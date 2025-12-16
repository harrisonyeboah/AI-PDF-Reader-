chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url?.endsWith('.pdf')) {
    console.log("[Background] PDF detected:", tab.url);
    /*
    try {
      const healthRes = await fetch('http://localhost:8080/api/pdf/health');
      const healthText = await healthRes.text();
      console.log("[Background] API response:", healthText);

      const processRes = await fetch('http://localhost:8080/api/pdf/splitPDF', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pdfUrl: tab.url })
      });

      const processData = await processRes.json();
      console.log("[Background] Process response:", processData);

      const audioBatchRes = await fetch('http://localhost:8080/api/pdf/getAudioBatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pdfUrls: processData })
      });

      const audioBatchData = await audioBatchRes.json();
      console.log("[Background] Audio batch response:", audioBatchData);

      // Send message to content script (main.js)
    */
    chrome.tabs.sendMessage(tabId, {
        action: 'playAudio',
        data: "This is my data"
    });
    console.log("Action sent playAudio to main.js");

    /*
    } catch (err) {
      console.error("[Background] API error:", err);
    }
    */
  }
});


chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "getTabInfo") {
    console.log("shout geronimo.");
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0]?.url || "";
      const isPdf = /\.pdf(\?|#|$)/i.test(url);
      sendResponse({ isPdf, url });
    });
    return true;
  }
});

