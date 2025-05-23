document.addEventListener("DOMContentLoaded", () => {
    const socket = io();

    //show draw mode is active on default
    const canvasContainer = document.getElementById('canvas-container');
    const toolbar = document.getElementById('toolbar');
    canvasContainer.classList.add('active');
    toolbar.classList.add('active');

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
    let draw = true;

    let cursorX = 0;
    let cursorY = 0;

    //highlight cursor position
    ctx.strokeStyle = "#008080FF";
    ctx.lineWidth = 2;
    ctx.strokeRect(cursorX * pixelSize, cursorY * pixelSize, pixelSize, pixelSize);

    socket.on('but', (numToSend) => {
        console.log("in button");
        console.log(numToSend);
        let moved = false;
        if (draw === false){
            return;
        }
        if (numToSend === 1){ //move up
            cursorY = Math.max(0, cursorY - 1);
            moved = true;
        }
        if (numToSend === 2){ //move down
            cursorY = Math.min(gridHeight - 1, cursorY + 1);
            moved = true;
        }
        if (numToSend === 3){ //move left
            cursorX = Math.max(0, cursorX - 1);
            moved = true;
            console.log("3333");
        }
        if (numToSend === 4){ //move right
            cursorX = Math.min(gridWidth - 1, cursorX + 1);
            moved = true;
            console.log("4444");
        }
        if (numToSend === 5){ //clear and save drawing
            // Convert the canvas to data
            var image = offscreenCanvas.toDataURL();
// Create a link
            var aDownloadLink = document.createElement('a');
// Add the name of the file to the link
            aDownloadLink.download = 'canvas.png';
// Attach the data to the link
            aDownloadLink.href = image;
// Get the code to click the download link
            aDownloadLink.click();

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            offCtx.clearRect(0, 0, canvas.width, canvas.height);

            //keep cursor highlighted
            ctx.strokeStyle = "#008080FF";
            ctx.lineWidth = 2;
            ctx.strokeRect(cursorX * pixelSize, cursorY * pixelSize, pixelSize, pixelSize);
        }
        if (numToSend === 6){ //switch between chat and canvas
            if (draw === false){
                draw = true;
            } else{
                draw = false;
                startChat();
            }
            updateBorder();
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

        const clear = document.getElementById("clear");

        /*clear.addEventListener("click", (e) => {
            // Convert the canvas to data
            var image = offscreenCanvas.toDataURL();
// Create a link
            var aDownloadLink = document.createElement('a');
// Add the name of the file to the link
            aDownloadLink.download = 'canvas.png';
// Attach the data to the link
            aDownloadLink.href = image;
// Get the code to click the download link
            aDownloadLink.click();

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            offCtx.clearRect(0, 0, canvas.width, canvas.height);

            //keep cursor highlighted
            ctx.strokeStyle = "#008080FF";
            ctx.lineWidth = 2;
            ctx.strokeRect(cursorX * pixelSize, cursorY * pixelSize, pixelSize, pixelSize);
        });*/

    // document.addEventListener("keydown", (e) => {
    //     if (e.key === "e") {
    //         if (draw === true) {
    //             draw = false;
    //             startChat();
    //             console.log(draw);
    //         } else if (draw === false) {
    //             draw = true;
    //         }
    //     }
    // })

    function updateBorder(){
        const canvasContainer = document.getElementById("canvas-container");
        const chatContainer = document.getElementById("chat-container");
        const toolbar = document.getElementById("toolbar");

        if (draw){
            canvasContainer.classList.add("active");
            toolbar.classList.add("active");
            chatContainer.classList.remove("active");
        }else{
            canvasContainer.classList.remove("active");
            toolbar.classList.remove("active");
            chatContainer.classList.add("active");
        }
    }

//CHAT
        document.getElementById("chat");

    function startChat() {
        const socket = io();
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
        socket.on('but', (numToSend) => {
            if (draw === true) {
                return;
            }
            if (numToSend === 1){
                console.log("here")
                msg = language[3];
                socket.emit('chat message', {msg, colour});
            }
            if (numToSend === 2){
                msg = language[0];
                socket.emit('chat message', {msg, colour});
            }
            if (numToSend === 3){
                msg = language[1];
                socket.emit('chat message', {msg, colour});
            }
            if (numToSend === 4){
                msg = language[2];
                socket.emit('chat message', {msg, colour});
            }
            if (numToSend === 6){ //goes back to canvas
                draw = true;
            }
            if (numToSend === 5){ //changes to dog or cat language
                if (n === 1) {
                    language = cats;
                    n = 0;
                } else {
                    language = dogs;
                    n = 1;
                }
            }
        });

            const messageInput = document.getElementById("messages");

            socket.on('chat message', ({msg, colour}) => {
                const item = document.createElement('li');
                item.style.color = colour;
                item.textContent = msg; //set the item to the user's entered message
                messages.appendChild(item); //add the message to the ul
                messages.scrollTop = messages.scrollHeight; //scrolls
                // window.scrollTo(0, document.messages.scrollHeight); //scrolls the messages
                //socket.auth.serverOffset = serverOffset;
            });
        }

})

