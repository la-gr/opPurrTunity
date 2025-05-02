
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
    const gridWidth = Math.floor(canvas.width / pixelSize);
    const gridHeight = Math.floor(canvas.height / pixelSize);

    offscreenCanvas.width = gridWidth;
    offscreenCanvas.height = gridHeight;


    let selectedColour = "#000000"
    let selectedTool = "brush";
    let draw = true;

    let cursorX = 0;
    let cursorY = 0;

//highlight cursor position
    ctx.strokeStyle = "#008080FF";
    ctx.lineWidth = 2;
    ctx.strokeRect(cursorX * pixelSize, cursorY * pixelSize, pixelSize, pixelSize);

//paint if buttons are pressed
    document.addEventListener("keydown", (e) => {
        if (draw === false) {
            return;
        }
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

    document.addEventListener("keydown", (e) => {
        if (e.key === "e") {
            if (draw === true) {
                draw = false;
                startChat();
                console.log(draw);
            } else if (draw === false) {
                draw = true;
            }
        }
    })

//CHAT
    document.getElementById("chat");

    function startChat() {
        const socket = io();
        console.log("in");
        let colour = generateRandomColor(); //sets the colour of the text
        function generateRandomColor() {
            let randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
            if (randomColor.length !== 7) { //if the color code is somehow invalid
                randomColor = generateRandomColor();
            }
            return randomColor;
        }

        const messages = document.getElementById('messages');
        const cats = ["meow", "hiss", "purr", "miaou"]; //cat sounds
        const dogs = ["bark", "woof", "arf", "ruff"]; //dog sounds
        let language = cats; //current language that the buttons will enter
        let n = 0;

        //message if buttons are pressed
        let msg = "";
        document.addEventListener("keydown", (e) => {
            if (draw === true) {
                return;
            }
            e.preventDefault();
            //enters a cat or dog sound on button click
            if (e.key === "w") {
                console.log("here")
                msg = language[3];
                socket.emit('chat message', {msg, colour});
            }
            if (e.key === "s") {
                msg = language[0];
                socket.emit('chat message', {msg, colour});
            }
            if (e.key === "a") {
                msg = language[1];
                socket.emit('chat message', {msg, colour});
            }
            if (e.key === "d") {
                msg = language[2];
                socket.emit('chat message', {msg, colour});
            }
            if (e.key === "e") { //goes back to canvas
                window.location.href = "index.html";
            }
            if (e.key === "f") { //changes to dog or cat language
                if (n === 1) {
                    language = cats;
                    n = 0;
                } else {
                    language = dogs;
                    n = 1;
                }
            }
        });

        socket.on('chat message', ({msg, colour}) => {
            const item = document.createElement('li');
            item.style.color = colour;
            item.textContent = msg; //set the item to the user's entered message
            messages.appendChild(item); //add the message to the ul
            window.scrollTo(0, document.chat.scrollHeight); //scrolls the messages
            //socket.auth.serverOffset = serverOffset;
        });
    }
