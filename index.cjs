const { Board, Button } = require("johnny-five");

// Initialize the board
const board = new Board({
    port: 'COM4'
});

board.on("ready", () => {
    console.log("Board is ready!");

    // Button 1 on Pin D2
    const button1 = new Button({
        pin: 2,
        isPullup: false  // Using external pull-down
    });

    // Button 2 on Pin D3
    const button2 = new Button({
        pin: 3,
        isPullup: false  // Using external pull-down
    });

    // Button 1 event
    button1.on("down", () => {
        console.log("Hello");
    });

    // Button 2 event
    button2.on("down", () => {
        console.log("World");
    });

    console.log("Press Button 1 (D2) or Button 2 (D3) to test!");
});

// Handle errors
board.on("error", (err) => {
    console.error("Board error:", err);
});
