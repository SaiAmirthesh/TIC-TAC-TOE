
//Gameboard
const Gameboard = (()=>{
    let gameboard = ["","","","","","","","",""];

    const render = () =>{
        var boardHTML="";
        gameboard.forEach((square, index)=>{
        boardHTML += `<div class="square" id=square-${index}">${square}</div>`;
        });
        document.getElementById("gameboard").innerHTML = boardHTML;
        
        const squares = document.querySelectorAll(".square");
        squares.forEach((square)=>{
            square.addEventListener("click", (event) =>{
                Game.handleclick(event);

            });
        });
    };

    const Update = (index,value) =>{
        if(gameboard[index] === "" && !Game.isGameOver()){
            gameboard[index] = value;
            render();
            return true;
        }
        return false;
    };

    const getGameboard = () => [...gameboard];

    const reset = () =>{
        gameboard = ["","","","","","","","",""];
        render();
        Game.start();
    };

    return{
        render,
        Update,
        getGameboard,
        reset
    };
})();


//Player creater
const createPlayer = (name,marker) =>{
    return{
        name: name || `player ${marker}`,
        marker
    };
};

const Game = (() => {
    let players = [];
    let currentPlayerIndex;
    let gameOver;

    const start = () => {
        players = [
            createPlayer(document.getElementById("player1").value, "X"),
            createPlayer(document.getElementById("player2").value, "O")
        ];
        currentPlayerIndex = 0;
        gameOver = false;
        Gameboard.render();
        updateStatus();
    };

    const handleclick = (event) => {
        if (isGameOver()) return;

        const index = parseInt(event.target.id.split("-")[1]);
        if (Gameboard.Update(index, players[currentPlayerIndex].marker)) {
            if (checkWin(players[currentPlayerIndex].marker)) {
                gameOver = true;
                updateStatus(`${players[currentPlayerIndex].name} wins!`);
                return;
            }
            if (checkDraw()) {
                gameOver = true;
                updateStatus("It's a draw!");
                return;
            }

            currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
            updateStatus();
        }
    };

    const checkWin = (marker) => {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6]             // diagonals
        ];

        const board = Gameboard.getGameboard();
        return winPatterns.some(pattern => {
            return pattern.every(index => board[index] === marker);
        });
    };

    const checkDraw = () => {
        return Gameboard.getGameboard().every(cell => cell !== "");
    };

    const updateStatus = (message) => {
        // Use the correct element, e.g., "message"
        const statusElement = document.getElementById("message");
        if (message) {
            statusElement.textContent = message;
        } else {
            statusElement.textContent = `${players[currentPlayerIndex].name}'s turn (${players[currentPlayerIndex].marker})`;
        }
    };

    const isGameOver = () => gameOver;

    return {
        start,
        handleclick,
        isGameOver
    };
})();


document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("start");
    startButton.addEventListener("click", () => {
        Game.start();
    });
});


document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("start");
    startButton.addEventListener("click", () => {
        Game.start();
    });

    const restartButton = document.getElementById("restart");
    restartButton.addEventListener("click", () => {
        Gameboard.reset();
    });
});