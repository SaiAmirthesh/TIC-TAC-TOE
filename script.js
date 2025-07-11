const cells = document.querySelectorAll('[data-cell]');
const message = document.getElementById('message');
const restartBtn = document.getElementById('restart');

const WINNING_COMBINATIONS = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

let xTurn;

function startGame() {
  xTurn = true;
  cells.forEach(cell => {
    cell.classList.remove('x', 'o');
    cell.textContent = '';
    cell.addEventListener('click', handleClick, { once: true });
  });
  setMessage("Player X's Turn");
}

function handleClick(e) {
  const cell = e.target;
  const current = xTurn ? 'x' : 'o';
  placeMark(cell, current);

  if (checkWin(current)) {
    endGame(false, current);
  } else if (isDraw()) {
    endGame(true);
  } else {
    xTurn = !xTurn;
    setMessage(`Player ${xTurn ? 'X' : 'O'}'s Turn`);
  }
}

function placeMark(cell, mark) {
  cell.classList.add(mark);
  cell.textContent = mark.toUpperCase();
}

function checkWin(current) {
  return WINNING_COMBINATIONS.some(combo => {
    return combo.every(index => cells[index].classList.contains(current));
  });
}

function isDraw() {
  return [...cells].every(cell =>
    cell.classList.contains('x') || cell.classList.contains('o')
  );
}

function endGame(draw, winner = null) {
  if (draw) {
    setMessage("It's a Draw!");
  } else {
    setMessage(`Player ${winner.toUpperCase()} Wins!`);
  }
  cells.forEach(cell => cell.removeEventListener('click', handleClick));
}

function setMessage(msg) {
  message.textContent = msg;
}

restartBtn.addEventListener('click', startGame);
startGame();
