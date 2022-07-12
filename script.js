
var Player1 = 'X';
var Player2 = 'O';
var isMultiPlayer = document.getElementsByName('player')[0].checked;
var isPlayer1turn = true;

function myfunc() {
  var par = document.getElementsByName('choice')[0];
  var index = par.selectedIndex;
  var ans = par.options[index].text;
  if (ans == 'X') {
    Player1 = 'X';
    Player2 = 'O';
  }
  else {
    Player1 = 'O';
    Player2 = 'X';

  }
}
function togglePlayer() {
  isMultiPlayer = !isMultiPlayer;
}

var origBoard;


const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2]
]

const cells = document.querySelectorAll('.cell');
startGame();

function startGame() {
  isPlayer1turn = true;
  document.querySelector(".endgame").style.display = "none";
  origBoard = Array.from(Array(9).keys());
  for (var i = 0; i < cells.length; i++) {
    cells[i].innerText = '';
    cells[i].style.removeProperty('background-color');
    cells[i].addEventListener('click', turnClick, false);
  }
}

function turnClick(square) {
  if (typeof origBoard[square.target.id] == 'number') {
    isPlayer1turn ? turn(square.target.id, Player1) : turn(square.target.id, Player2);
    isPlayer1turn = !isPlayer1turn;

    if (!checkWin(origBoard, Player1) && !checkTie() && !isMultiPlayer) {
      turn(bestSpot(), Player2);
      isPlayer1turn = !isPlayer1turn;

    }
  }

}

function turn(squareId, player) {
  origBoard[squareId] = player;
  document.getElementById(squareId).innerText = player;
  let gameWon = checkWin(origBoard, player)
  if (gameWon) gameOver(gameWon)
}

function checkWin(board, player) {
  let plays = board.reduce((a, e, i) =>
    (e === player) ? a.concat(i) : a, []);
  let gameWon = null;
  for (let [index, win] of winCombos.entries()) {
    if (win.every(elem => plays.indexOf(elem) > -1)) {
      gameWon = { index: index, player: player };
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon) {
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor =
      gameWon.player == Player1 ? "blue" : "red";
  }
  for (var i = 0; i < cells.length; i++) {
    cells[i].removeEventListener('click', turnClick, false);
  }
  declareWinner(gameWon.player == Player1 ? "You win!" : "You lose.");
}

function declareWinner(who) {
  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
  return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
  return minimax(origBoard, Player2).index;
}

function checkTie() {
  if (emptySquares().length == 0) {
    for (var i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = "yellow";
      cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner("Tie Game!")
    return true;
  }
  return false;
}

function minimax(newBoard, player) {
  var availSpots = emptySquares();

  if (checkWin(newBoard, Player1)) {
    return { score: -10 };
  } else if (checkWin(newBoard, Player2)) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }
  var moves = [];
  for (var i = 0; i < availSpots.length; i++) {
    var move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;

    if (player == Player2) {
      var result = minimax(newBoard, Player1);
      move.score = result.score;
    } else {
      var result = minimax(newBoard, Player2);
      move.score = result.score;
    }

    newBoard[availSpots[i]] = move.index;

    moves.push(move);
  }

  var bestMove;
  if (player === Player2) {
    var bestScore = -10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    var bestScore = 10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}
