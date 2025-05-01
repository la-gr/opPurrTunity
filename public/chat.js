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

    //message if buttons are pressed
    let msg = "";
    document.addEventListener("keydown", (e) => {
        e.preventDefault();
        if (e.key === "u") {
            msg = "meow";
            socket.emit('chat message', {msg, colour});
        }
        if (e.key === "i") {
            msg = "woof";
            socket.emit('chat message', {msg, colour});
        }
        if (e.key === "o") {
            msg = "hiss";
            socket.emit('chat message', {msg, colour});
        }
        if (e.key === "p") {
            msg="bark";
            socket.emit('chat message', {msg, colour});
        }
    });

    /*form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (input.value) {
            let msg = input.value;
            socket.emit('chat message', {msg, colour});
            input.value = '';
            input.readOnly = true;
        }
    });*/

    /*let username = localStorage.getItem("namee");
    console.log(username);
    socket.emit("user", {username});

    /*function sendImage(mag) {
        const imageUrl = mag;
        if (imageUrl) {
            socket.emit("send image", {username, imageUrl}); // Send image URL to server
        }
    }*/

    socket.on('chat message', ({msg, colour}) => {
        const item = document.createElement('li');
        console.log("colour: " + colour);
        item.style.color = colour;
        item.textContent = msg; //set the item to the user's entered message
        messages.appendChild(item); //add the message to the ul
        window.scrollTo(0, document.messages.scrollHeight); //scrolls the messages
        socket.auth.serverOffset = serverOffset;
    });
});