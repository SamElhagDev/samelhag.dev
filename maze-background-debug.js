// Paste this in the browser console (F12) to debug the maze background

console.log('=== Maze Background Diagnostics ===');

// Check if canvas exists
const canvas = document.getElementById('bg');
console.log('1. Canvas element:', canvas ? '✅ Found' : '❌ Not found');
if (canvas) {
    console.log('   - Canvas width:', canvas.width);
    console.log('   - Canvas height:', canvas.height);
    console.log('   - Canvas style.width:', canvas.style.width);
    console.log('   - Canvas style.height:', canvas.style.height);
    console.log('   - Canvas z-index:', window.getComputedStyle(canvas).zIndex);
    console.log('   - Canvas background:', window.getComputedStyle(canvas).background);
}

// Check if initMazeBackground function exists
console.log('2. initMazeBackground function:', typeof initMazeBackground !== 'undefined' ? '✅ Found' : '❌ Not found');

// Check body background
console.log('3. Body background:', window.getComputedStyle(document.body).backgroundColor);

// Check if maze animation is running
console.log('4. To manually start animation, run: initMazeBackground()');

// Check for any error messages
console.log('5. Check console above for any error messages with ❌');
