# SpeedSlap - Roadmap & Changelog

## Completed Features

- [x] Draggable speed control overlay
- [x] Keyboard shortcuts (customizable)
- [x] Auto-hide after inactivity
- [x] Position persistence
- [x] Speed persistence
- [x] Auto caption enable
- [x] Settings popup (functional)
- [x] Configurable speed range
- [x] Configurable toggle speed
- [x] Live settings sync
- [x] Hotkey customization with modifier support
- [x] Reset to 1x hotkey
- [x] Scroll wheel speed control
- [x] Input field protection
- [x] Custom app icon
- [x] Redesigned popup UI
- [x] Redesigned overlay with branding
- [x] Toast notifications with icon
- [x] GitHub Pages landing page
- [x] Toggle for overlay visibility
- [x] Toggle for toast notifications
- [x] Toggle for captions

---

## Future Enhancements

### Medium Priority

- [ ] **Event-driven captions** - Replace polling with MutationObserver
- [ ] **YouTube Shorts support** - Different video element structure
- [ ] **Speed presets** - Quick buttons for common speeds (1x, 1.5x, 2x, 3x)
- [ ] **Remember per-channel** - Different default speeds per channel

### Low Priority / Nice to Have

- [ ] **Minimize button** - Collapse UI to just speed indicator
- [ ] **Audio pitch correction** - Prevent chipmunk voice at high speeds
- [ ] **Statistics** - Track time saved at higher speeds
- [ ] **Export/import settings** - Backup configuration
- [ ] **Chrome Web Store** - Publish to store

---

## Technical Debt

- [ ] Add error handling for missing video element
- [ ] Consider using shadow DOM for UI isolation
- [ ] Add version migration for storage schema changes

---

## Changelog

### v1.3.2 (2026-02-02) - Live Updates
- Overlay now updates live when settings change (no refresh needed)

### v1.3.1 (2026-02-02) - Autosave & Browser Limit
- Autosave - settings save automatically on change, no button needed
- Max speed capped at 16x (browser HTML5 video limit)

### v1.3 (2026-02-02) - Settings Overhaul

**New Toggles:**
- Show/hide floating overlay
- Show/hide toast notifications
- Enable/disable force captions

**UI:**
- New "UI & Features" section in popup
- All features now configurable

---

### v1.2 (2026-02-02) - SpeedSlap Rebrand

**Rebrand:**
- Renamed from "YouTube Speed Master" to **SpeedSlap**
- New landing page with animated icon

**New Features:**
- Customizable keyboard shortcuts with full modifier support (Ctrl, Shift, Alt)
- Key recording UI in popup settings
- New reset hotkey (backtick) to instantly return to 1x
- Scroll wheel speed control on overlay (scroll up/down to adjust)
- Shift + scroll for fine 0.1x adjustments
- Enable/disable scroll wheel in settings

**Bug Fixes:**
- Input field protection - shortcuts no longer fire when typing in comments, search, etc.
- Silenced caption polling console warnings

**UI Improvements:**
- New custom app icon (created with ICON_GEN_TOOL)
- Completely redesigned popup with gradient header and branding
- Redesigned overlay with icon header and "Speed Master" title
- Toast notifications now include icon
- Modern styling with orange accent color throughout
- Smooth animations and hover effects

**Other:**
- GitHub Pages landing page
- Updated documentation

### v1.1 (2026-02-02)

- Settings now functional and sync across tabs
- Configurable speed range (min/max)
- Configurable SLAP toggle speed
- Dark theme popup UI
- Input validation

### v1.0 (Initial)

- Draggable speed control overlay
- 0.5x - 10x speed range
- SLAP toggle (1x ↔ 3x)
- Keyboard shortcuts (Numpad+, [, ])
- Auto-hide after 2s inactivity
- Position persistence
- Speed persistence
- Auto caption enable

---

## Icon Generator Tool

Located in `/ICON/ICON_GEN_TOOL.html` - a standalone HTML tool for generating the extension icon with:
- Adjustable circle, triangle, and speed line geometry
- Filled or hollow triangle option
- Animation preview
- Grid/ruler guides for alignment
- Export at multiple sizes (16px, 48px, 128px, master PNG)
- Reset to defaults button
