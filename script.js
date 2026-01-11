let GameBoard = ["","","","","","","","",""];
let currentPlayer = "X";
let gameOver = false;

function startGame(){
    GameBoard = ["","","","","","","","",""];
    currentPlayer = "X";
    gameOver = false;
    renderBoard();
    updateStatus(`${currentPlayer}'s turn`);    
}

function renderBoard(){
    const boardContainer = document.getElementById("gameboard");
    boardContainer.innerHTML = "";
    for (let i = 0; i < 9; i++) {
        const square = document.createElement("div");
        square.classList.add("square");
        square.innerText = GameBoard[i];
        square.addEventListener("click", () => handleCellClick(i));
        boardContainer.appendChild(square);
    }
}

function handleCellClick(index){
    if (gameOver || GameBoard[index] !== "") {
        return;
    }

    GameBoard[index] = currentPlayer;  
    renderBoard();
    checkWin();
    if(!gameOver){
        checkDraw();
    }
    if (!gameOver) {
        switchPlayer();
        updateStatus(`${currentPlayer}'s turn`);
    }
}

function checkWin(){
    const winPatterns = [ 
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]
    ];
    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (GameBoard[a] && GameBoard[a] === GameBoard[b] && GameBoard[a] === GameBoard[c]) {
            updateStatus(`${currentPlayer} wins!`);
            drawLine([a,b,c]);
            gameOver = true;
            return;
        }
    }
}   

function checkDraw(){
    if (!gameOver && GameBoard.every(cell => cell !== "")) {
        updateStatus("It's a draw!");
        gameOver = true;
        return;
    }    
}

function switchPlayer(){
    if (currentPlayer === "X") {
        currentPlayer = "O";
    }else{
        currentPlayer = "X";
    }
}

function updateStatus(message){
    document.getElementById("message").innerText = message;
}

function drawLine(pattern){
    const squares = document.querySelectorAll(".square");
    pattern.forEach(i => {
        squares[i].style.backgroundColor = "#a1eaa1";
        squares[i].style.color = "#000000";
    });
}

document.getElementById("restart").addEventListener("click", startGame);
document.getElementById("start").addEventListener("click", startGame);
