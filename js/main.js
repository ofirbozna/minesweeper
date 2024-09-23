'use strict'

var gBoard
var gLevel = {
    size: 4,
    mines: 2,
}
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
}

const MINE_IMG = '<img src="img/mine.png">'


//called when page loads
function onInit() {
    gBoard = buildBoard()
    renderBoard(gBoard)
    console.log(gBoard)

    
    


}


//buildn ther boards, set the mines, callse setTheMinesNegsCount(), return the created board
function buildBoard() {
    var board = []
    var size = gLevel.size

    for (var i = 0; i < size; i++) {
        board[i] = []

        for (var j = 0; j < size; j++) {

            board[i][j] = {
                minesAroundCount:0,
                isShown: false,
                isMine: false,
                isMarked: false,
            }
        }
    }
    board[1][3].isMine = true
    board[2][0].isMine =true
    board[1][1].isMine =true
    
    
    return board
}

/// counts the mmines around each cell, set the cell's minesAruondCount 


function setTheMinesNegsCount(board, rowIdx, colIdx) {
    var mineCount = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            if (i === rowIdx && j === colIdx) continue
            const currCell = board[i][j]
            if (currCell.isMine) {
                mineCount++


            }
        }
        
    }
    board[rowIdx][colIdx].minesAroundCount = mineCount
    return mineCount
     
}


//render the board as table to the page
function renderBoard(board) {
    var strHtml = ''
    for (var i = 0; i < board.length; i++) {
        strHtml += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            const currCell = board[i][j]
            setTheMinesNegsCount(board , i , j)
            strHtml += `<td class="cell ${i}-${j}">`

            if (currCell.isMine) {
                strHtml += MINE_IMG

            } else if (currCell.minesAroundCount != 0) {
                strHtml += currCell.minesAroundCount
            }
            strHtml += '</td> \n'


        }
        strHtml += '</tr>'


    }

    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHtml

}


//called when a cekk is clicked
function onCellClicked() {

}


//called when a cell is right clicked 
function onCellMarekd(elCell, i, j) {

}


// game ends when all the other cells are shown
function checkGameOver() {

}


//when user clickes a cell with no mines around we need to open not only that cell but also its neightbors
function expendShown(board, elCell, i, j) {

}