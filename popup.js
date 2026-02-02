// Default hotkeys
const defaultHotkeys = {
    toggle: { code: 'NumpadAdd', ctrl: false, shift: false, alt: false },
    speedUp: { code: 'BracketRight', ctrl: false, shift: false, alt: false },
    speedDown: { code: 'BracketLeft', ctrl: false, shift: false, alt: false },
    reset: { code: 'Backquote', ctrl: false, shift: false, alt: false }
};

let hotkeys = { ...defaultHotkeys };
let recordingAction = null;

// Convert key code to display name
function keyCodeToDisplay(hotkey) {
    const parts = [];
    if (hotkey.ctrl) parts.push('Ctrl');
    if (hotkey.alt) parts.push('Alt');
    if (hotkey.shift) parts.push('Shift');

    // Convert code to readable name
    let keyName = hotkey.code;
    const codeMap = {
        'NumpadAdd': 'Numpad +',
        'NumpadSubtract': 'Numpad -',
        'NumpadMultiply': 'Numpad *',
        'NumpadDivide': 'Numpad /',
        'NumpadEnter': 'Numpad Enter',
        'Numpad0': 'Numpad 0',
        'Numpad1': 'Numpad 1',
        'Numpad2': 'Numpad 2',
        'Numpad3': 'Numpad 3',
        'Numpad4': 'Numpad 4',
        'Numpad5': 'Numpad 5',
        'Numpad6': 'Numpad 6',
        'Numpad7': 'Numpad 7',
        'Numpad8': 'Numpad 8',
        'Numpad9': 'Numpad 9',
        'BracketLeft': '[',
        'BracketRight': ']',
        'Backquote': '`',
        'Backslash': '\\',
        'Slash': '/',
        'Period': '.',
        'Comma': ',',
        'Semicolon': ';',
        'Quote': "'",
        'Minus': '-',
        'Equal': '=',
        'Space': 'Space',
        'Enter': 'Enter',
        'Escape': 'Esc',
        'ArrowUp': 'Up',
        'ArrowDown': 'Down',
        'ArrowLeft': 'Left',
        'ArrowRight': 'Right'
    };

    if (codeMap[keyName]) {
        keyName = codeMap[keyName];
    } else if (keyName.startsWith('Key')) {
        keyName = keyName.slice(3);
    } else if (keyName.startsWith('Digit')) {
        keyName = keyName.slice(5);
    }

    parts.push(keyName);
    return parts.join(' + ');
}

// Update display of all hotkeys
function updateHotkeyDisplays() {
    document.getElementById('hotkeyToggle').textContent = keyCodeToDisplay(hotkeys.toggle);
    document.getElementById('hotkeySpeedUp').textContent = keyCodeToDisplay(hotkeys.speedUp);
    document.getElementById('hotkeySpeedDown').textContent = keyCodeToDisplay(hotkeys.speedDown);
    document.getElementById('hotkeyReset').textContent = keyCodeToDisplay(hotkeys.reset);
}

// Handle key recording
function handleKeyRecording(e) {
    if (!recordingAction) return;

    e.preventDefault();
    e.stopPropagation();

    // Ignore modifier-only keypresses
    if (['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) {
        return;
    }

    // Cancel on Escape
    if (e.code === 'Escape') {
        stopRecording();
        return;
    }

    // Record the new hotkey
    hotkeys[recordingAction] = {
        code: e.code,
        ctrl: e.ctrlKey,
        shift: e.shiftKey,
        alt: e.altKey
    };

    stopRecording();
    updateHotkeyDisplays();
}

// Start recording a hotkey
function startRecording(action) {
    // If already recording this action, cancel
    if (recordingAction === action) {
        stopRecording();
        return;
    }

    // Stop any existing recording
    stopRecording();

    recordingAction = action;
    const btn = document.querySelector(`[data-action="${action}"]`);
    const valueSpan = document.getElementById('hotkey' + action.charAt(0).toUpperCase() + action.slice(1));

    btn.classList.add('recording');
    btn.textContent = 'Cancel';
    valueSpan.classList.add('recording');
    valueSpan.textContent = 'Press a key...';

    document.addEventListener('keydown', handleKeyRecording, true);
}

// Stop recording
function stopRecording() {
    if (!recordingAction) return;

    const btn = document.querySelector(`[data-action="${recordingAction}"]`);
    const valueSpan = document.getElementById('hotkey' + recordingAction.charAt(0).toUpperCase() + recordingAction.slice(1));

    btn.classList.remove('recording');
    btn.textContent = 'Change';
    valueSpan.classList.remove('recording');

    document.removeEventListener('keydown', handleKeyRecording, true);
    recordingAction = null;
    updateHotkeyDisplays();
}

// Load saved settings when popup opens
document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get(['minSpeed', 'maxSpeed', 'toggleSpeed', 'hotkeys', 'enableScrollWheel', 'showOverlay', 'showToasts', 'enableCaptions'], (result) => {
        if (result.minSpeed !== undefined) {
            document.getElementById('minSpeed').value = result.minSpeed;
        }
        if (result.maxSpeed !== undefined) {
            document.getElementById('maxSpeed').value = result.maxSpeed;
        }
        if (result.toggleSpeed !== undefined) {
            document.getElementById('toggleSpeed').value = result.toggleSpeed;
        }
        if (result.hotkeys !== undefined) {
            hotkeys = result.hotkeys;
        }
        if (result.enableScrollWheel !== undefined) {
            document.getElementById('enableScrollWheel').checked = result.enableScrollWheel;
        }
        if (result.showOverlay !== undefined) {
            document.getElementById('showOverlay').checked = result.showOverlay;
        }
        if (result.showToasts !== undefined) {
            document.getElementById('showToasts').checked = result.showToasts;
        }
        if (result.enableCaptions !== undefined) {
            document.getElementById('enableCaptions').checked = result.enableCaptions;
        }
        updateHotkeyDisplays();
    });

    // Add click handlers for change buttons
    document.querySelectorAll('.change-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            startRecording(btn.dataset.action);
        });
    });
});

// Save settings
document.getElementById('saveSettings').addEventListener('click', () => {
    const minSpeed = parseFloat(document.getElementById('minSpeed').value);
    const maxSpeed = parseFloat(document.getElementById('maxSpeed').value);
    const toggleSpeed = parseFloat(document.getElementById('toggleSpeed').value);
    const enableScrollWheel = document.getElementById('enableScrollWheel').checked;
    const showOverlay = document.getElementById('showOverlay').checked;
    const showToasts = document.getElementById('showToasts').checked;
    const enableCaptions = document.getElementById('enableCaptions').checked;

    // Validate
    if (minSpeed >= maxSpeed) {
        alert('Min speed must be less than max speed!');
        return;
    }
    if (toggleSpeed < minSpeed || toggleSpeed > maxSpeed) {
        alert('Toggle speed must be within the speed range!');
        return;
    }

    chrome.storage.sync.set({ minSpeed, maxSpeed, toggleSpeed, hotkeys, enableScrollWheel, showOverlay, showToasts, enableCaptions }, () => {
        const msg = document.getElementById('savedMsg');
        msg.style.display = 'block';
        setTimeout(() => {
            msg.style.display = 'none';
        }, 2000);
    });
});
