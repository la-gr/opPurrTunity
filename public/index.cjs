const { Board, Button } = require("johnny-five");

//Initialize the board
/*const board = new d({
    port: 'COM4'
});*/
const board = new Board();

board.on("ready", () => {
    console.log("Board is ready!");

    //Button 1 on pin D2
    const button1 = new Button({
        pin: 2,
        isPullup: false  // Using external pull-down
    });

    //Button 2 on pin D3
    const button2 = new Button({
        pin: 3,
        isPullup: false  // Using external pull-down
    });

    //when button 1 clicked
    button1.on("down", () => {
        console.log("Hello");
    });

    //when button 2 clicked
    button2.on("down", () => {
        console.log("World");
    });
});

//errors
board.on("error", (err) => {
    console.error("Board error:", err);
});
