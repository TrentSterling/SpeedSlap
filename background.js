chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Handle message from content script
    if (message.type === 'enableCaptions') {
        const languageCode = message.languageCode || 'en'; // Default to 'en'
        console.log(`[background.js] Enabling captions for language: ${languageCode}`);

        // Send response back to content script
        sendResponse({ status: 'captions_enabled', languageCode });
    }
});
