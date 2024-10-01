require('dotenv').config()

const API_KEY = process.env.API_KEY;

const width = 500;   /* width of the window */
const height = 800;   /* height of the window */

const horizontalGap = 0;  /* gap from left or right of the screen */
const verticalGap = 0;  /* gap from top or bottom of the screen */

const horizontalPosition = 'center'  /* value must be 'center', 'left' or 'right' :  controls position of window on screen */
const verticalPosition = 'center'  /* value must be 'center', 'top' or 'bottom' :  controls position of window on screen */

// NOTE : gaps would be ignored if window is at center

module.exports = {
    width, height,
    horizontalGap, verticalGap,
    horizontalPosition, verticalPosition,
    API_KEY
}