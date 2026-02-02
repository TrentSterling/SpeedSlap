console.log('SpeedSlap v1.2 running!');

let isSpeedOn = false;
let currentSpeed = 1;
let opacityTimeout;
let dragging = false;
let offsetX, offsetY;
let captionsSet = false;

// Settings with defaults
let minSpeed = 0.5;
let maxSpeed = 10;
let toggleSpeed = 3;
let enableScrollWheel = true;

// Default hotkeys
let hotkeys = {
    toggle: { code: 'NumpadAdd', ctrl: false, shift: false, alt: false },
    speedUp: { code: 'BracketRight', ctrl: false, shift: false, alt: false },
    speedDown: { code: 'BracketLeft', ctrl: false, shift: false, alt: false },
    reset: { code: 'Backquote', ctrl: false, shift: false, alt: false }
};

let uiX = localStorage.getItem('uiX') || '10px';
let uiY = localStorage.getItem('uiY') || '80px';

const controlsContainer = document.createElement('div');
Object.assign(controlsContainer.style, {
    position: 'fixed',
    top: uiY,
    left: uiX,
    zIndex: '99999',
    backgroundColor: 'rgba(20, 20, 20, 0.9)',
    padding: '12px',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '8px',
    cursor: 'grab',
    transition: 'opacity 0.3s ease-in-out',
    opacity: '0',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
    border: '1px solid rgba(255, 87, 51, 0.3)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
});
document.body.appendChild(controlsContainer);

// Header row with icon
const headerRow = document.createElement('div');
Object.assign(headerRow.style, {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    paddingBottom: '6px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    marginBottom: '4px'
});

const iconImg = document.createElement('img');
iconImg.src = chrome.runtime.getURL('app_icon.png');
Object.assign(iconImg.style, {
    width: '20px',
    height: '20px',
    borderRadius: '4px'
});

const titleSpan = document.createElement('span');
titleSpan.textContent = 'SpeedSlap';
Object.assign(titleSpan.style, {
    fontSize: '11px',
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: '0.5px'
});

headerRow.append(iconImg, titleSpan);
controlsContainer.appendChild(headerRow);

controlsContainer.addEventListener('mousedown', (e) => {
    if ([button, speedSlider, sliderLabel, iconImg, titleSpan].includes(e.target)) return;
    dragging = true;
    offsetX = e.clientX - controlsContainer.getBoundingClientRect().left;
    offsetY = e.clientY - controlsContainer.getBoundingClientRect().top;
    const moveHandler = (e) => {
        if (!dragging) return;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        let newX = Math.max(0, Math.min(e.clientX - offsetX, windowWidth - controlsContainer.offsetWidth));
        let newY = Math.max(0, Math.min(e.clientY - offsetY, windowHeight - controlsContainer.offsetHeight));
        controlsContainer.style.left = `${newX}px`;
        controlsContainer.style.top = `${newY}px`;
    };
    const stopDrag = () => {
        dragging = false;
        localStorage.setItem('uiX', controlsContainer.style.left);
        localStorage.setItem('uiY', controlsContainer.style.top);
        document.removeEventListener('mousemove', moveHandler);
        document.removeEventListener('mouseup', stopDrag);
    };
    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('mouseup', stopDrag);
});

const button = document.createElement('button');
Object.assign(button.style, {
    padding: '10px 16px',
    backgroundColor: '#555',
    color: 'white',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    borderRadius: '6px',
    transition: 'all 0.2s ease',
    textTransform: 'uppercase',
    letterSpacing: '1px'
});
button.textContent = 'SLAP OFF';
button.addEventListener('click', toggleSpeedFn);
button.addEventListener('mouseenter', () => {
    button.style.transform = 'scale(1.02)';
});
button.addEventListener('mouseleave', () => {
    button.style.transform = 'scale(1)';
});

const speedSlider = document.createElement('input');
Object.assign(speedSlider, { type: 'range', min: minSpeed, max: maxSpeed, step: 0.1, value: currentSpeed });
Object.assign(speedSlider.style, {
    width: '200px',
    height: '6px',
    cursor: 'pointer',
    accentColor: '#FF5733'
});
speedSlider.addEventListener('input', updateSpeed);

// Load settings from sync storage and apply
function loadSettings() {
    chrome.storage.sync.get(['minSpeed', 'maxSpeed', 'toggleSpeed', 'hotkeys', 'enableScrollWheel'], (result) => {
        if (result.minSpeed !== undefined) {
            minSpeed = parseFloat(result.minSpeed);
            speedSlider.min = minSpeed;
        }
        if (result.maxSpeed !== undefined) {
            maxSpeed = parseFloat(result.maxSpeed);
            speedSlider.max = maxSpeed;
        }
        if (result.toggleSpeed !== undefined) {
            toggleSpeed = parseFloat(result.toggleSpeed);
        }
        if (result.hotkeys !== undefined) {
            hotkeys = result.hotkeys;
        }
        if (result.enableScrollWheel !== undefined) {
            enableScrollWheel = result.enableScrollWheel;
        }
        console.log(`Settings loaded: min=${minSpeed}, max=${maxSpeed}, toggle=${toggleSpeed}, scrollWheel=${enableScrollWheel}`);
    });
}

// Listen for settings changes from popup
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync') {
        if (changes.minSpeed) {
            minSpeed = parseFloat(changes.minSpeed.newValue);
            speedSlider.min = minSpeed;
        }
        if (changes.maxSpeed) {
            maxSpeed = parseFloat(changes.maxSpeed.newValue);
            speedSlider.max = maxSpeed;
        }
        if (changes.toggleSpeed) {
            toggleSpeed = parseFloat(changes.toggleSpeed.newValue);
        }
        if (changes.hotkeys) {
            hotkeys = changes.hotkeys.newValue;
        }
        if (changes.enableScrollWheel) {
            enableScrollWheel = changes.enableScrollWheel.newValue;
        }
        showNotification('Settings updated!');
    }
});

loadSettings();

const sliderLabel = document.createElement('span');
Object.assign(sliderLabel.style, {
    padding: '4px 0',
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    textAlign: 'center'
});
sliderLabel.textContent = `Speed: ${currentSpeed}x`;

controlsContainer.append(button, speedSlider, sliderLabel);

function setCaptions(languageCode = 'en') {
    if (captionsSet) {
        console.log('Captions already set, skipping...');
        return;
    }
    console.log('Injecting captions script...');
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('injected.js');
    script.dataset.languageCode = languageCode;
    document.documentElement.appendChild(script);
    script.remove();
}

function setVideoSpeed(speed) {
    const video = document.querySelector('video');
    if (video) {
        video.playbackRate = speed;
        chrome.storage.local.set({ lastSpeed: speed });
    }
    speedSlider.value = speed;
    sliderLabel.textContent = `Speed: ${speed}x`;
}

function toggleSpeedFn() {
    isSpeedOn = !isSpeedOn;
    currentSpeed = isSpeedOn ? toggleSpeed : 1;
    setVideoSpeed(currentSpeed);
    button.textContent = isSpeedOn ? 'SLAP ON' : 'SLAP OFF';
    button.style.backgroundColor = isSpeedOn ? '#FF5733' : '#555';
    button.style.boxShadow = isSpeedOn ? '0 2px 10px rgba(255, 87, 51, 0.4)' : 'none';
    showNotification(isSpeedOn ? `SLAP! Speed ON: ${currentSpeed}x` : `SLAP! Speed OFF: Normal`);
    resetOpacity();
}

function resetToNormal() {
    isSpeedOn = false;
    currentSpeed = 1;
    setVideoSpeed(currentSpeed);
    button.textContent = 'SLAP OFF';
    button.style.backgroundColor = '#555';
    button.style.boxShadow = 'none';
    showNotification('Speed reset to 1x');
    resetOpacity();
}

function setCustomSpeed(value) {
    currentSpeed = value;
    setVideoSpeed(currentSpeed);
    showNotification(`Speed set to: ${value}x`);
    resetOpacity();
}

function updateSpeed() {
    setCustomSpeed(parseFloat(speedSlider.value));
}

function showNotification(message) {
    const notification = document.createElement('div');
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(20, 20, 20, 0.95)',
        color: 'white',
        padding: '10px 16px',
        borderRadius: '10px',
        zIndex: '99999',
        fontSize: '13px',
        fontWeight: '600',
        opacity: '0',
        pointerEvents: 'none',
        transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
        border: '1px solid rgba(255, 87, 51, 0.3)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    });

    const notifIcon = document.createElement('img');
    notifIcon.src = chrome.runtime.getURL('app_icon.png');
    Object.assign(notifIcon.style, {
        width: '24px',
        height: '24px'
    });

    const notifText = document.createElement('span');
    notifText.textContent = message;

    notification.append(notifIcon, notifText);
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(-50%) translateY(10px)';
    }, 100);
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(-50%) translateY(-10px)';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

chrome.storage.local.get(['lastSpeed'], (result) => {
    if (result.lastSpeed) {
        currentSpeed = result.lastSpeed;
        setVideoSpeed(currentSpeed);
    }
});

function resetOpacity() {
    clearTimeout(opacityTimeout);
    controlsContainer.style.opacity = '1';
    opacityTimeout = setTimeout(() => {
        controlsContainer.style.opacity = '0';
    }, 2000);
}

['mouseenter', 'mouseleave', 'mousemove'].forEach(event => {
    controlsContainer.addEventListener(event, resetOpacity);
    speedSlider.addEventListener(event, resetOpacity);
    button.addEventListener(event, resetOpacity);
});

// Check if a hotkey matches the current keydown event
function matchesHotkey(e, hotkey) {
    return e.code === hotkey.code &&
           e.ctrlKey === hotkey.ctrl &&
           e.shiftKey === hotkey.shift &&
           e.altKey === hotkey.alt;
}

document.addEventListener('keydown', (e) => {
    // Don't intercept when typing in input fields
    // Check both e.target and document.activeElement for robustness
    const target = e.target;
    const active = document.activeElement;

    function isEditable(el) {
        if (!el) return false;
        const tag = el.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA') return true;
        if (el.isContentEditable) return true;
        if (el.getAttribute('contenteditable')) return true;
        if (el.getAttribute('role') === 'textbox') return true;
        if (el.closest('[contenteditable]')) return true;
        if (el.closest('[role="textbox"]')) return true;
        return false;
    }

    if (isEditable(target) || isEditable(active)) {
        return;
    }

    // Check for toggle hotkey
    if (matchesHotkey(e, hotkeys.toggle)) {
        e.preventDefault();
        toggleSpeedFn();
        return;
    }

    // Check for reset hotkey
    if (matchesHotkey(e, hotkeys.reset)) {
        e.preventDefault();
        resetToNormal();
        return;
    }

    // Check for speed up/down hotkeys (with shift modifier for fine adjust)
    // Note: For speed up/down, we check the base key but allow shift to modify the step
    const speedUpBase = { ...hotkeys.speedUp, shift: false };
    const speedDownBase = { ...hotkeys.speedDown, shift: false };

    if (e.code === hotkeys.speedUp.code &&
        e.ctrlKey === hotkeys.speedUp.ctrl &&
        e.altKey === hotkeys.speedUp.alt) {
        e.preventDefault();
        const step = e.shiftKey ? 0.1 : 0.5;
        const newSpeed = Math.min(maxSpeed, currentSpeed + step);
        setCustomSpeed(Math.round(newSpeed * 10) / 10);
        return;
    }

    if (e.code === hotkeys.speedDown.code &&
        e.ctrlKey === hotkeys.speedDown.ctrl &&
        e.altKey === hotkeys.speedDown.alt) {
        e.preventDefault();
        const step = e.shiftKey ? 0.1 : 0.5;
        const newSpeed = Math.max(minSpeed, currentSpeed - step);
        setCustomSpeed(Math.round(newSpeed * 10) / 10);
        return;
    }
});

// Scroll wheel speed control on overlay
controlsContainer.addEventListener('wheel', (e) => {
    if (!enableScrollWheel) return;

    e.preventDefault();
    e.stopPropagation();
    const step = e.shiftKey ? 0.1 : 0.5;
    const direction = e.deltaY < 0 ? 1 : -1; // Scroll up = increase, scroll down = decrease
    const newSpeed = Math.max(minSpeed, Math.min(maxSpeed, currentSpeed + (step * direction)));
    setCustomSpeed(Math.round(newSpeed * 10) / 10);
}, { passive: false });

// Use an interval to attempt setting captions until they are successfully set
let captionsInterval;

function startCaptionsInterval() {
    captionsInterval = setInterval(() => {
        if (!captionsSet) {
            console.log('Attempting to set captions...');
            setCaptions();
        } else {
            console.log('Captions already set; clearing interval.');
            clearInterval(captionsInterval);
        }
    }, 2000);
}

// Start the initial interval
startCaptionsInterval();

// Use yt-navigate-finish event to reset the captions flag with a delay
document.addEventListener('yt-navigate-finish', () => {
    console.log('yt-navigate-finish detected, scheduling captions flag reset...');
    setTimeout(() => {
        captionsSet = false;
        console.log('Captions flag reset for new video.');
        // Clear the old interval and restart it
        clearInterval(captionsInterval);
        startCaptionsInterval();
    }, 2000);
});

// Listen for messages from the injected script
window.addEventListener('message', (event) => {
    if (event.source !== window) return;
    if (event.data.type === 'captions_enabled') {
        if (!captionsSet) {
            console.log(`[content.js] Captions enabled: ${event.data.languageCode}`);
            captionsSet = true;
            showNotification(`Captions enabled: ${event.data.languageCode}`);
        } else {
            console.log('Captions already enabled; ignoring duplicate message.');
        }
    }
});
