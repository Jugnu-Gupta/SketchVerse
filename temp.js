// Get the canvas element
const forcanvas = document.querySelector("[for-canvas]");
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Variables to track the drawing state
let isDrawing = false;
let startX = 0;
let startY = 0;
let lineWidth = 5;
let drawnArray = [];
let isDragging = false;
let shape = "pen";

let leftOffset = 0;
let topOffset = 0;

// Zooming
let scaleFactor = 1.0;
const zoomSpeed = 0.1;

// function changeHandler(event) {
//     document.querySelector("[change]").innerHTML = `${canvas.width}x${canvas.height} : ${event.clientX || 0}x${event.clientY || 0}`;
// }

function printCoordinates(x, y) {
    document.querySelector("[change]").innerHTML = `${parseInt(x)}x${parseInt(y)}`;
}

function shapeHandler(_shape) {
    shape = _shape;
    console.log(shape);
}

// Function to start drawing
function startDrawing(event) {
    console.log(shape);
    if (shape === "pen") {
        isDrawing = true;
        isDragging = false;

        const len = drawnArray.length;
        drawnArray.push([]);
    }
    else if (shape === "hand") {
        isDragging = true;
        isDrawing = false;
    }
    [startX, startY] = adjustCoordinates(event.clientX, event.clientY);
}

// Function to draw lines
function draw(event) {
    if (!isDrawing && !isDragging) return;

    // Get the current mouse position
    const [x, y] = adjustCoordinates(event.clientX, event.clientY);

    // changeHandler(event);
    const _x = startX;
    const _y = startY;

    if (isDrawing) {

        // Draw a line from the last position to the current position.
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(x, y);
        context.stroke();

        // store path.
        const len = drawnArray.length;
        drawnArray[len - 1].push({ startX: _x, startY: _y, endX: x, endY: y, shape: "pen" });
    }
    else if (isDragging) {
        let translateX = _x - x;
        let translateY = _y - y;

        topOffset = Math.min(canvas.width, Math.max(0, topOffset + translateX));
        leftOffset = Math.min(canvas.width, Math.max(0, leftOffset + translateY));

        window.scrollTo(topOffset, leftOffset);

        printCoordinates(leftOffset, topOffset);
        // printCoordinates(window.innerWidth / scaleFactor, window.innerHeight / scaleFactor);

        // drag
        // document.querySelector('canvas').style.transform = `translate(${translateX}px, ${translateY}px)`;
        // document.querySelector('canvas').style.transition = `5ms all`;
    }

    // Update the last position.
    [startX, startY] = [x, y];
}

// Function to stop drawing
function stopDrawing() {
    isDrawing = false;
    isDragging = false;
}

function handleResize() {
    // const width = canvas.width;
    // const height = canvas.height;

    console.log(canvas.width);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    for (let i = 0; i < drawnArray.length; i++) {
        for (let j = 0; j < drawnArray[i].length; j++) {

            // console.log(drawnArray[i][j]);
            context.beginPath();
            context.moveTo(drawnArray[i][j].startX, drawnArray[i][j].startY);
            context.lineTo(drawnArray[i][j].endX, drawnArray[i][j].endY);
            context.stroke();

        }
    }
}

canvas.addEventListener('wheel', (event) => {

    const zoomOut = event.deltaY < 0;
    // console.log(scaleFactor);

    if (zoomOut) {
        if (scaleFactor < 2)
            scaleFactor += zoomSpeed;
    } else {
        if (scaleFactor > 0.7)
            scaleFactor -= zoomSpeed;
    }

    if (scaleFactor > 1) {
        canvas.style.marginTop = `${canvas.height * (scaleFactor - 1) * .5 - 6}px`;
        canvas.style.marginLeft = `${canvas.width * (scaleFactor - 1) * .5 - 8}px`;
    }
    else if (scaleFactor <= 1) {
        canvas.style.marginTop = `${0}px`;
        canvas.style.marginLeft = `${0}px`;
    }
    canvas.style.transform = `scale(${scaleFactor})`;
});

// Reset zoom
window.addEventListener('dblclick', () => {
    scaleFactor = 1.0;
    console.log("jhvhj");
    canvas.style.transform = `scale(${scaleFactor})`;
});

function adjustCoordinates(x, y) {
    // getBoundingClientRect method providing information about the size of an element and its position 
    // relative to the viewport. It includes properties such as top, right, bottom, left, width, and height.
    const rect = canvas.getBoundingClientRect();

    // Adjust coordinates based on canvas position and zoom factor
    x -= rect.left;
    y -= rect.top;

    x /= scaleFactor;
    y /= scaleFactor;

    if (rect.left < 0) {
        x += x * 0.025;
        y += y * 0.025;
    }
    return [x, y];
}

document.addEventListener('click', (event) => { console.log(event.clientX + " " + event.clientY), console.log(scaleFactor) });

// Add event listeners for drawing
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
window.addEventListener('resize', handleResize);
canvas.addEventListener('mouseout', stopDrawing);