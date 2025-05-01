
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
    window.location.href = "chat.html";

    //keep cursor highlighted
    ctx.strokeStyle = "#008080FF";
    ctx.lineWidth = 2;
    ctx.strokeRect(cursorX * pixelSize, cursorY * pixelSize, pixelSize, pixelSize);
});