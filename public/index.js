const { Board, Button } = require("johnny-five");

//Initialize the board
const board = new Board({
    port: 'COM4'
});

board.on("ready", () => {
    console.log("Board is ready!");
    let moved = false;

    //Button 1 on pin D2
    const up = new Button({
        pin: 2,
        isPullup: false  // Using external pull-down
    });

    //Button 2 on pin D3
    const down = new Button({
        pin: 3,
        isPullup: false  // Using external pull-down
    });

    //Button 3 on pin D3
    const left = new Button({
        pin: 4,
        isPullup: false  // Using external pull-down
    });

    //Button 4 on pin D3
    const right = new Button({
        pin: 5,
        isPullup: false  // Using external pull-down
    });

    //when button 1 clicked
    up.on("down", () => {
        console.log("Hello");
        cursorY = Math.max(0, cursorY - 1);
        moved = true;
    });

    //when button 2 clicked
    down.on("down", () => {
        console.log("World");
        cursorY = Math.min(gridHeight - 1, cursorY + 1);
        moved = true;
    });

    //when button 3 clicked
    left.on("down", () => {
        console.log("here");
        cursorX = Math.max(0, cursorX - 1);
        moved = true;
    });

    right.on("down", () => {
        console.log("not here");
        cursorX = Math.min(gridWidth - 1, cursorX + 1);
        moved = true;
    });

    if (moved) {
        paintAtCursor();
    }

    render();

    console.log("Press Button 1 (D2) or Button 2 (D3) to test!");
});

//errors
board.on("error", (err) => {
    console.error("Board error:", err);
});



const brush = document.getElementById("brush");
const buttons = document.querySelectorAll("button");
const clickSound = new Audio('audio/button click.mp3');

//play a sound everytime a button is clicked
buttons.forEach(button => {
    button.addEventListener("click", () => {
        clickSound.volume = 0.4;
        clickSound.play(); // Play the sound
    });
});

//onscreen canvas (what the user sees)
const canvas = document.getElementById("canvas");
//use ctx to draw on the canvas
const ctx = canvas.getContext("2d");
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

//offscreen canvas (what is being drawn on)
const offscreenCanvas = document.createElement("canvas");
const offCtx = offscreenCanvas.getContext("2d");

//defining the pixel grid
const pixelSize = 16;
const gridWidth =  Math.floor(canvas.width / pixelSize);
const gridHeight =  Math.floor(canvas.height / pixelSize);

offscreenCanvas.width = gridWidth;
offscreenCanvas.height = gridHeight;


let selectedColour = "#000000"
let selectedTool = "brush";
let draw = false;

let cursorX = 0;
let cursorY = 0;

//highlight cursor position
ctx.strokeStyle = "#008080FF";
ctx.lineWidth = 2;
ctx.strokeRect(cursorX * pixelSize, cursorY * pixelSize, pixelSize, pixelSize);

//paint if buttons are pressed
document.addEventListener("keydown", (e) => {
    let moved = false;

    if (e.key === "w") {
        cursorY = Math.max(0, cursorY - 1);
        moved = true;
    }
    if (e.key === "s") {
        cursorY = Math.min(gridHeight - 1, cursorY + 1);
        moved = true;
    }
    if (e.key === "a") {
        cursorX = Math.max(0, cursorX - 1);
        moved = true;
    }
    if (e.key === "d") {
        cursorX = Math.min(gridWidth - 1, cursorX + 1);
        moved = true;
    }

    if (moved) {
        paintAtCursor();
    }

    render();
});

function paintAtCursor() {
    offCtx.fillStyle = selectedColour;
    offCtx.fillRect(cursorX, cursorY, 1, 1);
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(offscreenCanvas, 0, 0, canvas.width, canvas.height);

    //highlight cursor
    ctx.strokeStyle = "#008080FF";
    ctx.lineWidth = 2;
    ctx.strokeRect(cursorX * pixelSize, cursorY * pixelSize, pixelSize, pixelSize);
}

//clear canvas
const clear = document.getElementById("clear");

clear.addEventListener("click", (e) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    offCtx.clearRect(0, 0, canvas.width, canvas.height);

    //keep cursor highlighted
    ctx.strokeStyle = "#008080FF";
    ctx.lineWidth = 2;
    ctx.strokeRect(cursorX * pixelSize, cursorY * pixelSize, pixelSize, pixelSize);
});
