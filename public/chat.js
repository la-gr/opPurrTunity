document.addEventListener("DOMContentLoaded", () => {
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
    document.addEventListener("keydown", (e) => {
        e.preventDefault();
        //enters a cat or dog sound on button click
        if (e.key === "w") {
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
            if (n === 1){
                language = cats;
                n = 0;
            } else{
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
        window.scrollTo(0, document.body.scrollHeight); //scrolls the messages
        //socket.auth.serverOffset = serverOffset;
    });
});