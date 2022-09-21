/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 4;
const HEIGHT = 4;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  for (let i = 0; i < HEIGHT; i++){
    //make an array for the row
    board[i] = []
    for (let j = 0; j < WIDTH; j++){
      //fill all the cells with null
      board[i][j] = null
    }
  }
}


/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {

  const htmlBoard = document.querySelector("#board") 

  //make a row and make id "column-top", add a click event on it
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);
  //make the first row of cells and make their ids the x coordinate
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
    const hoverCell = document.createElement("div");
    hoverCell.classList.add("hoverPiece")
    headCell.append(hoverCell)
   
  }
  htmlBoard.append(top);

  //make all the rows of the game 
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    //for each row of the game, make a cell (column), and make the ids their respective y-x coordinates
    for (var x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

function makeButton() {
  const playAgainBtn = document.querySelector("#playAgain")
  playAgainBtn.addEventListener('click', () => playAgain())
  playAgainBtn.style.display = 'none'
  playAgainBtn.classList.remove('results')
}

function playAgain() {
  document.querySelector("#playAgain").style.display = 'none'
  document.querySelector("#playAgain").classList.remove('results')
  reset()
  makeBoard();
  makeHtmlBoard();
}
/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  for (i = 0; i < HEIGHT; i++){
    if (!board[HEIGHT-1-i][x]) {
      return HEIGHT-1-i;      
    }
  }
  return null
}


function placeInTable(y, x) {
  const newDiv = document.createElement("div")
  newDiv.classList.add('piece')
  newDiv.classList.add('p' + currPlayer)
  newDiv.style.top = (y+1)*57 + "px"
  document.getElementById(y +"-"+x).append(newDiv)
}

/** endGame: announce game end */

function endGame(msg) {
  document.querySelector("#playAgain").style.display = 'inline-block'
  document.querySelector("#results").innerText = msg;
  document.querySelector("#results").classList.add('results')
  document.getElementById("column-top").removeEventListener("click", handleClick);
}

function reset() {
  document.querySelector(".results").innerText = ""
  document.querySelector("#results").classList.remove('results')
  const theparent = document.querySelector("#board")
  while (theparent.firstChild) {
    theparent.firstChild.remove()
  }
  currPlayer=1
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  //have to determine whether we clicked on the div or not
  let x
  if (evt.target.classList.contains('hoverPiece')) {
    //this means they clicked on div
     x = +evt.target.parentElement.id
  } else {
    x = +evt.target.id;  
  }

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  placeInTable(y, x);
  board[y][x] = currPlayer

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer==1?'red':'blue'} won!`);
  }

  // check for tie
  const allFilled = board.every(cells => cells.every(cell=>cell !== null))
  allFilled? endGame("It's a tie!"): ''

  // switch players
  currPlayer === 1 ? currPlayer = 2 : currPlayer = 1 
  //change background color for the first row
  for (let i = 0; i < WIDTH; i++){
    document.getElementById(i).children[0].classList.toggle("p2hover")
  }
  
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

//for each row, and for each cell in the row, do the following
  for (var y = 0; y < HEIGHT; y++) {
    for (var x = 0; x < WIDTH; x++) {
      //check if all 4 horizontal squares are filled with the same player's piece
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      //check if all 4 vertical squares are filled with the same player's piece
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      //check if all 4 diagonal right squares are filled with the same player's piece
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      //check if all 4 diagonal left squares are filled with the same player's piece
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
makeButton();
