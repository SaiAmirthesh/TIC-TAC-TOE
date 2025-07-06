document.addEventListener('DOMContentLoaded', () => {
    // Game Board Module
    const GameBoard = (() => {
        let board = Array(9).fill('');
        
        const getBoard = () => [...board];
        
        const markCell = (index, marker) => {
            if (board[index] === '' && index >= 0 && index < 9) {
                board[index] = marker;
                return true;
            }
            return false;
        };
        
        const resetBoard = () => {
            board = Array(9).fill('');
        };
        
        return { getBoard, markCell, resetBoard };
    })();

    // Player Factory
    const Player = (name, marker) => {
        let score = 0;
        
        const getName = () => name;
        const getMarker = () => marker;
        const getScore = () => score;
        const incrementScore = () => score++;
        const resetScore = () => score = 0;
        
        return { getName, getMarker, getScore, incrementScore, resetScore };
    };

    // Game Controller
    const GameController = (() => {
        let player1, player2, currentPlayer, gameOver;
        
        const startGame = (playerOneName, playerTwoName) => {
            player1 = Player(playerOneName, 'X');
            player2 = Player(playerTwoName, 'O');
            currentPlayer = player1;
            gameOver = false;
            GameBoard.resetBoard();
            updatePlayerDisplay();
        };
        
        const switchPlayer = () => {
            currentPlayer = currentPlayer === player1 ? player2 : player1;
            updatePlayerDisplay();
        };
        
        const getCurrentPlayer = () => currentPlayer;
        
        const playRound = (cellIndex) => {
            if (gameOver || !GameBoard.markCell(cellIndex, currentPlayer.getMarker())) {
                return false;
            }
            
            if (checkWin()) {
                currentPlayer.incrementScore();
                gameOver = true;
                return { winner: currentPlayer, isDraw: false };
            }
            
            if (checkDraw()) {
                gameOver = true;
                return { winner: null, isDraw: true };
            }
            
            switchPlayer();
            return true;
        };
        
        const checkWin = () => {
            const winPatterns = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
                [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
                [0, 4, 8], [2, 4, 6]             // diagonals
            ];
            
            return winPatterns.some(pattern => {
                const [a, b, c] = pattern;
                const board = GameBoard.getBoard();
                return board[a] && board[a] === board[b] && board[a] === board[c];
            });
        };
        
        const checkDraw = () => {
            return GameBoard.getBoard().every(cell => cell !== '');
        };
        
        const updatePlayerDisplay = () => {
            document.getElementById('player1-display').classList.toggle('active', currentPlayer === player1);
            document.getElementById('player2-display').classList.toggle('active', currentPlayer === player2);
        };
        
        const getPlayers = () => ({ player1, player2 });
        
        return { startGame, playRound, getCurrentPlayer, getBoard: GameBoard.getBoard, getPlayers };
    })();

    // Display Controller
    const DisplayController = (() => {
        const boardElement = document.getElementById('gameboard');
        const statusElement = document.getElementById('status');
        const restartButton = document.getElementById('restart');
        const startButton = document.getElementById('start-btn');
        const gameArea = document.querySelector('.game-area');
        const player1Input = document.getElementById('player1');
        const player2Input = document.getElementById('player2');
        
        const renderBoard = () => {
            boardElement.innerHTML = '';
            GameController.getBoard().forEach((cell, index) => {
                const cellElement = document.createElement('div');
                cellElement.classList.add('cell');
                
                if (cell === 'X') cellElement.classList.add('x');
                if (cell === 'O') cellElement.classList.add('o');
                
                cellElement.textContent = cell;
                cellElement.dataset.index = index;
                cellElement.addEventListener('click', handleCellClick);
                boardElement.appendChild(cellElement);
            });
        };
        
        const updateStatus = (message, isWinner = false) => {
            statusElement.textContent = message;
            statusElement.classList.toggle('winner', isWinner);
        };
        
        const handleCellClick = (e) => {
            const cellIndex = parseInt(e.target.dataset.index);
            const result = GameController.playRound(cellIndex);
            
            if (result === false) return;
            
            renderBoard();
            
            if (result.isDraw) {
                updateStatus("Game ended in a draw!");
            } else if (result.winner) {
                updateStatus(`${result.winner.getName()} wins!`, true);
            } else {
                updateStatus(`${GameController.getCurrentPlayer().getName()}'s turn`);
            }
        };
        
        const handleRestart = () => {
            const { player1, player2 } = GameController.getPlayers();
            GameController.startGame(player1.getName(), player2.getName());
            renderBoard();
            updateStatus(`${GameController.getCurrentPlayer().getName()}'s turn`);
        };
        
        const handleStart = () => {
            const player1Name = player1Input.value.trim() || 'Player 1';
            const player2Name = player2Input.value.trim() || 'Player 2';
            
            // Update player displays with names
            document.getElementById('player1-display').querySelector('.player-name').textContent = player1Name;
            document.getElementById('player2-display').querySelector('.player-name').textContent = player2Name;
            
            GameController.startGame(player1Name, player2Name);
            gameArea.classList.remove('hidden');
            renderBoard();
            updateStatus(`${player1Name}'s turn`);
        };
        
        const init = () => {
            restartButton.addEventListener('click', handleRestart);
            startButton.addEventListener('click', handleStart);
        };
        
        return { init };
    })();

    // Initialize the game
    DisplayController.init();
});