***

# Project: Kinetic Logo Generator

A powerful, single-file HTML5 canvas tool for generating a specific kinetic "fast play" logo. This tool provides granular control over every geometric and aesthetic aspect of the icon, allowing for both precise static designs and fluid, dynamic animations. It's built to be fully portable—just save the `.html` file and run it in any modern browser.

The primary goal of this tool is to deconstruct an AI-generated concept into a clean, mathematically perfect, and highly customizable graphic that can be exported for production use, such as browser extension icons or web assets.

## Core Features

*   **Single-File Portability:** The entire tool—UI, logic, and styles—is contained in one `.html` file. No servers, no dependencies.
*   **Dual Mode Operation:**
    *   **Static Mode:** Precisely recreate a static version of the logo, perfect for app icons and branding.
    *   **Animated Mode:** Bring the logo to life with a "rocket engine" bounce and flowing "exhaust" lines.
*   **Deep Customization:** Dozens of parameters allow you to control everything from line thickness and position to animation speed and bounce intensity.
*   **Transparent Export:** A dedicated toggle allows for exporting the logo with a transparent background, ready for any context.
*   **Browser Extension Packager:** Includes one-click export buttons for standard browser extension icon sizes (128x128, 48x48, 16x16), in addition to the full-resolution master PNG.

## How to Use

1.  Copy the entire code from the latest version.
2.  Paste it into a plain text editor (like VS Code, Sublime Text, Notepad++, etc.).
3.  Save the file with an `.html` extension (e.g., `logo_generator.html`).
4.  Double-click the saved file to open it in your web browser.

## Parameter Guide

The user interface is divided into logical sections, each controlling a different aspect of the logo.

### Global Controls

*   **Animate:** Toggles the animation loop. When disabled, the logo is perfectly static.
*   **Master X Position:** A global horizontal offset for the entire composition, used for final centering.
*   **Master Scale:** Zooms the entire logo in or out without affecting the canvas resolution.
*   **BG Color:** Sets the background color of the canvas.
*   **Transparent:** When checked, this overrides the BG Color and exports a PNG with a transparent alpha channel.
*   **Icon Color:** Sets the color for all foreground elements (lines, circle, triangle).
*   **Flow Speed:** Controls the velocity of the "exhaust" gaps in the speed lines.
*   **Bounce:** Controls the vertical amplitude of the "rocket" (circle and triangle) animation.

### Circle Geometry

*   **Radius:** The radius of the main circle ring.
*   **Stroke:** The thickness of the main circle ring.
*   **Pos X:** A local horizontal offset for the circle and its child elements (the triangle).

### Triangle (Hollow)

*   **Size:** Controls the overall size of the play triangle.
*   **Stroke:** The thickness of the triangle's outline.
*   **Roundness:** The corner radius of the triangle's points.
*   **Offset X:** A local horizontal offset for the triangle *relative to the circle's center*.

### Speed Lines

*   **Count:** The number of speed lines to draw (from 2 to 6).
*   **Thickness:** The thickness of each speed line.
*   **Vertical Spread:** The amount of vertical space between each line.
*   **Circle Gap:** The distance between the right edge of the lines and the left edge of the circle's ring.
*   **Anchor X:** A master horizontal control that moves the right-most edge of all lines.

### Line Tweaks (Splits)

For each of the 6 possible lines, two sliders are available:
*   **Line [N] Length:** The total length of the individual line.
*   **Split Size:** The size of the gap in the line. In static mode, this creates a fixed break. In animated mode, this defines the size of the flowing "exhaust" bubble.

## Implemented Features

*   **Ruler & Guide System:**
    *   **NxN Grid:** Toggle to overlay a yellow dashed grid for composition. Configurable divisions (2-10).
    *   **Center Crosshairs:** Toggle to display green dashed crosshairs at the canvas center with a center dot.
    *   **Custom Guides:** Click canvas edges to add cyan guide lines. Drag to reposition. Double-click to delete. "Clear All Guides" button to reset.

*   **Filled Triangle Option:** Toggle between hollow (stroke) and filled triangle for the play button.

*   **Reset to Defaults:** Button to restore all settings to the app_icon.png configuration.

## Future Plans

*   **Animation Easing Controls:** Add options to control the easing functions for the bounce and flow animations (e.g., `ease-in-out`, `linear`, `elastic`).

*   **SVG Export:** Implement a function to generate and download the logo as an SVG file for resolution-independent scaling.

*   **Preset Management:** Allow users to save their current slider configurations as named presets and load them later.