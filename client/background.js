/* This basically listens for the url when the url ends with .pdf it 
is aware that is is a pdf file.*/
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && tab.url.endsWith('.pdf')) {
        // Send a message to open your custom PDF reader
        chrome.tabs.sendMessage(tabId, {
            action: 'openPDFReader',
            url: tab.url
        });
        console.log(tab.url)
    }
});


