const { Board, Button } = require("johnny-five");

//Initialize the board
const board = new Board({
    port: 'COM5',
    repl: false
});

board.on("ready", () => {
    console.log("Board is ready!");

    //Button 1 on pin D2
    const button1 = new Button({pin: 2, isPullup: false });
    //Button 2 on pin D3
    const button2 = new Button({ pin: 3, isPullup: false });
    //Button 3 on pin D4
    const button3 = new Button({pin: 4, isPullup: false });
    //Button 4 on pin D9
    const button4 = new Button({ pin: 9, isPullup: false });
    //Button 5 on pin D11
    const button5 = new Button({pin: 11, isPullup: false });
    //Button 6 on pin D12
    const button6 = new Button({ pin: 12, isPullup: false });

    //when button 1 clicked
    button1.on("down", () => {
        console.log("click");
        try {
            process.send({
                type: 'buttonEvent',
                num: 1
            });
        } catch (err) {
            console.error('Failed to send message:', err);
        }
    });
    //when button 2 clicked
    button2.on("down", () => {
        console.log("click");

        try {
            process.send({
                type: 'buttonEvent',
                num: 2
            });
        } catch (err) {
            console.error('Failed to send message:', err);
        }
    });
    //when button 3 clicked
    button3.on("down", () => {
        console.log("click");

        try {
            process.send({
                type: 'buttonEvent',
                num: 3
            });
        } catch (err) {
            console.error('Failed to send message:', err);
        }
    });
    //when button 4 clicked
    button4.on("down", () => {
        console.log("click");
        try {
            process.send({
                type: 'buttonEvent',
                num: 4
            });
        } catch (err) {
            console.error('Failed to send message:', err);
        }
    });
    //when button 5 clicked
    button5.on("down", () => {
        console.log("clicked");
        try {
            process.send({
                type: 'buttonEvent',
                num: 5
            });
        } catch (err) {
            console.error('Failed to send message:', err);
        }
    });
    //when button 6 clicked
    button6.on("down", () => {
        try {
            process.send({
                type: 'buttonEvent',
                num: 6
            });
        } catch (err) {
            console.error('Failed to send message:', err);
        }
    });

    process.send({ status: 'Arduino ready' });
});

//errors
// Handle IPC errors
process.on('disconnect', () => {
    console.log('Disconnected from parent process');
});
board.on("error", (err) => {
    console.error("Board error:", err);
});
