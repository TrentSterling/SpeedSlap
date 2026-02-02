(function() {
    const languageCode = document.currentScript.dataset.languageCode || 'en';
    const player = document.getElementById('movie_player');

    if (player && typeof player.setOption === 'function') {
        player.setOption('captions', 'track', { languageCode });
        console.log('[injected.js] Captions enabled:', languageCode);

        // Send message to content script (not background) to notify captions enabled
        window.postMessage(
            { type: 'captions_enabled', languageCode },
            '*'
        );
    }
    // Silent fail - content.js retries every 2 seconds until player is ready
})();
