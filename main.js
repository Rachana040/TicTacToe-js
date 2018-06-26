var origBoard; //an array that keeps track of values in the board(X/0/nothing)
const huPlayer = 'O';
const compPlayer = 'X';

//array containing all winning combinations
const winComb = [
 [0,1,2],
 [3,4,5],
 [6,7,8],
 [0,3,6],
 [1,4,7],
 [2,5,8],
 [0,4,8],
 [6,4,2]
];

const cells = document.querySelectorAll(".cell"); //cells has reference to all elements having class cell
startGame();

function  startGame() {
    document.querySelector(".endgame").style.display = "none";
    origBoard = Array.from(Array(9).keys()); //creating an array of 9 elements each with key(0-8)


    for(var i = 0;i<cells.length;i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');//on replay if there was any highlighted color for winning combination
        cells[i].addEventListener('click',turnClick,false);
    }
}

function turnClick(square) {

    if(typeof origBoard[square.target.id] == 'number') {
        turn(square.target.id,huPlayer);
        //now comp turn
        if( !checkTie() ) {
            turn(bestSpot(),compPlayer);
        }
    }

}

function turn(squareId,player) {
    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(origBoard,player);
    if(gameWon)
        gameOver(gameWon);
}

function checkWin(board,player) {
    let plays = []//to get all ids of that player
    for(let i = 0;i < board.length;i++) {
        if(board[i] === player) {
            plays.push(i);
        }
    }
    let gameWon = null;
    let flag;
    for (let [index, win] of winComb.entries()) {
        flag = true;
        for(let i = 0;i < 3;i++) {
            //console.log(win[i]);
            if(plays.indexOf(win[i]) === -1) {
                flag = false;
                break;
            }
        }
        if(flag){
            gameWon = {index : index,player: player };
            break;
        }

    }

    return gameWon; //has the index of winning combination and player details.
}

function gameOver(gameWon) {

    let color = gameWon.player === huPlayer ? "blue" : "red";
    for (let index of winComb[gameWon.index]) {
        document.getElementById(index).style.backgroundColor = color;
    }

    //remove event listener so that user cant click on any of the cells
    for (let i = 0;i < cells.length;i++) {
        cells[i].removeEventListener('click',turnClick,false);
    }


    declareWinner(gameWon.player === huPlayer  ? "You Win!" : "You Lose!");
}

function declareWinner(winner) {
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerHTML = winner;
}

function emptySquares() {
    let emptysqr = [];
    for(let i = 0;i < origBoard.length;i++) {
        if(typeof origBoard[i] == 'number')
            emptysqr.push(i);
    }
    return emptysqr;
}
function bestSpot() {
    let val = emptySquares().length;
    return emptySquares()[Math.floor(Math.random()*val)];
}

function checkTie() {
    if(emptySquares().length == 0) {
        for(let i = 0;i < cells.length;i++) {
            cells[i].style.backgroundColor = "green";
            cells[i].removeEventListener('click',turnClick,false);
        }
        declareWinner("Tie Game");
        return true;
    }
    return false;
}
