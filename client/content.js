console.log('PDF Reader content script loaded');

/* This is the front end aspect to my chrome extension. So basically. This part 
basically will detect all the pdf links in the html and recommend that the user 
use the noto pdf reader. This is an aspect of my chrome extensions front end. 
*/

/* This aspect spends time to detect PDF content on the page. 
This will then recommend the user to use Noto Reader Extennsion.
*/
function detectPDFContent() {
    const pdfElements = document.querySelectorAll('embed[type="application/pdf"], object[type="application/pdf"]');
    const pdfLinks = document.querySelectorAll('a[href$=".pdf"]');

    if (pdfElements.length > 0 || pdfLinks.length > 0) {
        // This displays the add pdf button on the page. 
        addPDFReaderButton();
    }
}
/* This is our function that basically runs when pdf content is 
detected on the page. */
function addPDFReaderButton() {
    if (document.getElementById('pdf-reader-button')) return;
    // Create a floating PDF reader button
    const button = document.createElement('div');
    button.id = 'pdf-reader-button';
    button.innerHTML = 'PDFs Detected By Noto';
    button.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #1b1c1d  0%,rgb(65, 65, 65)  100%);
        color: white;
        padding: 10px 15px;
        border-radius: 25px;
        cursor: pointer;
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        transition: transform 0.2s ease;
    `;

    /* This is for button hover effect */
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-2px)';
    });
    /* This is for button non hover effect */
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
    });

    document.body.appendChild(button);
}

/* This is for DOM rendering purposes. Waits until the pages is done loading. 
Then runs the detectPDFContent function.
*/
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', detectPDFContent);
} else {
    detectPDFContent();
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'openPDFReader') {
        console.log('Message received from background:', message.url);
        /* This listens to my pdf listener if per say a pdf is detected then 
        render that that Noto Reader has detected pdf and recommends the user to use noto
        reader. */
        addPDFReaderButton();
        sendResponse({ success: true });
    }
});


// content-script.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'playAudio') {
        console.log("Recieved from contetn.js");
        window.postMessage({
            type: 'FROM_EXTENSION',
            action: 'playAudio',
            data: message.data
        }, '*');
    }
});


