'use strict'
// קובץ הכי מעודכן
var gBoard
var gLevel = {
    size: 4,
    mines: 3,
}
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
}
var gEmptyCells = []
var gCheckedCells = []
var gIsFlaged = false
var gIsMinesSet = false
var gLives = 3
var gTimer
var gStartTime = 0
var elapsedTime = 0
var gIsRuning = false
var gElTimer = document.querySelector('.timer')
gElTimer.innerText = '00:00:00:00'
var gIsHintPressed = false
var gBestScore=Infinity



const MINE_IMG = '<img src="img/mine.png">'
const FLAG_IMG = '<img src="img/flag.png">'


//called when page loads
function onInit() {
    gGame.isOn = true
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    gLives = 3
    gBoard = buildBoard()
    renderBoard(gBoard)
    gIsMinesSet = false
    gStartTime = 0
    elapsedTime = 0
    gIsRuning = false
    gElTimer.innerText = '00:00:00:00'

}


//buildn ther boards, set the mines, callse setTheMinesNegsCount(), return the created board
function buildBoard() {
    var board = []
    var size = gLevel.size

    for (var i = 0; i < size; i++) {
        board[i] = []

        for (var j = 0; j < size; j++) {

            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
            }
        }
    }
    // board[1][3].isMine = true
    // board[2][0].isMine = true
    // board[1][1].isMine = true


    return board
}

//render the board as table to the page
function renderBoard(board) {

    var strHtml = ''
    for (var i = 0; i < board.length; i++) {
        strHtml += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            const currCell = board[i][j]
            strHtml += `<td class='cell' data-i="${i}" data-j="${j}" onclick= "onCellClicked(this,${i},${j})" oncontextmenu="onCellMarekd(event,this, ${i},${j})">`
            strHtml += '</td> \n'


        }
        strHtml += '</tr>'


    }

    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHtml

}
/// counts the mmines around each cell, set the cell's minesAruondCount 


function changeBoardSize(size, minesNum) {
    clearInterval(gTimer)
    gLevel.size = size
    gLevel.mines = minesNum
    onInit()
}


function setTheMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            getCellNegsCount(board, i, j)
        }
    }
}


function getCellNegsCount(board, rowIdx, colIdx) {

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


function getRandomMinesLocation(board, numOfMines) {
    if (gIsMinesSet) return
    gEmptyCells = []
    getEmptyCells(board)
    for (var i = 0; i < numOfMines; i++) {
        const randomIdx = getRandomInt(0, gEmptyCells.length)
        const randomCell = gEmptyCells[randomIdx]
        var location = board[randomCell.i][randomCell.j]
        //modal
        location.isMine = true
        //DOM will be changed onclick
        gEmptyCells.splice(randomIdx, 1)
        gIsMinesSet = true
    }
}


function getEmptyCells(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            if (currCell.isShown) continue
            gEmptyCells.push({ i: i, j: j })

        }
    }
    console.log(gEmptyCells)
    return gEmptyCells
}


//called when a cell is clicked
function onCellClicked(elCell, i, j) {
    setTimer()
    if (!gGame.isOn) return
    const currCell = gBoard[i][j]
    if (currCell.isMarked) return

    //modal
    currCell.isShown = true
    //DOM
    elCell.classList.add('shown')
    getRandomMinesLocation(gBoard, gLevel.mines)
    setTheMinesNegsCount(gBoard)
    console.log(gBoard)

    if (gIsHintPressed) {
        getHint(elCell, i, j)
    }


    if (!gIsHintPressed) {
        var elHeart = document.querySelector('.heart')
        var elRestartBtn = document.querySelector('.restart')
        if (currCell.isMine) {
            gLives--
            gGame.shownCount++
            if (gLives === 2) elHeart.innerHTML = '&#x2665&#x2665'
            if (gLives === 1) elHeart.innerHTML = '&#x2665'
            elCell.innerHTML = MINE_IMG
            if (gLives === 0) {
                gGame.isOn = false
                console.log('GAME OVER')
                showMinesCells()
                elHeart.innerHTML = '--'
                elRestartBtn.innerHTML = ' | &#x1F635;&#x200D;&#x1F4AB;'
                clearInterval(gTimer)
            }
        } else if (!currCell.isMine && currCell.minesAroundCount !== 0 && currCell.isShown === true) {
            gGame.shownCount++
            //DOM
            elCell.innerText = currCell.minesAroundCount

        } else if (currCell.minesAroundCount === 0 && currCell.isShown === true) {
            gGame.shownCount++
            expendShown(gBoard, elCell, i, j)

        }
        checkGameOver()
    }
}


// called when a cell is right clicked 
function onCellMarekd(event, elCell, i, j) {
    const currCell = gBoard[i][j]
    event.preventDefault()
    if (!currCell.isMarked) {
        //modal
        currCell.isMarked = true
        //DOM
        elCell.innerHTML = FLAG_IMG
        if (currCell.isMine) gGame.markedCount++

    } else if (currCell.isMarked) {
        currCell.isMarked = false
        elCell.innerHTML = ''
        if (currCell.isMine) gGame.markedCount--
    }
    checkGameOver()
}


// game ends when all the other cells are shown
function checkGameOver() {
    if (gLives === 0) return
    const numOfCells = Math.pow(gLevel.size, 2)
    console.log('show', gGame.shownCount)
    console.log('markes', gGame.markedCount)
    if (gGame.shownCount + gGame.markedCount === numOfCells) {
        console.log('winnerrr!!')
        gGame.isOn = false
        var elRestartBtn = document.querySelector('.restart')
        elRestartBtn.innerHTML = ' | &#x1F60E '
        clearInterval(gTimer)
        checkBestScore()
    }

}


function checkBestScore() {
    // if (gLives === 0) return
    // if (gGame.shownCount + gGame.markedCount === numOfCells) {
    if (gGame.secsPassed < gBestScore) {
        gBestScore = gGame.secsPassed

    }
    console.log(gBestScore)
    localStorage.bestScore = gBestScore
    var elBesrScore= document.querySelector('.bestscore')
    elBesrScore.innerHTML = localStorage.bestScore
}



function showMinesCells() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMine) {
                const currCell = gBoard[i][j]
                const selector = `[data-i="${i}"][data-j="${j}"]`
                const elCell = document.querySelector(selector)
                elCell.innerHTML = MINE_IMG
            }
        }
    }
}


//when user clickes a cell with no mines around we need to open not only that cell but also its neightbors
function expendShown(board, elCell, rowIdx, colIdx) {
    var numOfShownCells = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board[i].length) continue

            if (rowIdx === gCheckedCells[0] && colIdx === gCheckedCells[1]) continue


            const currCell = board[i][j]
            const selector = `[data-i="${i}"][data-j="${j}"]`
            const elNegCell = document.querySelector(selector)


            if (currCell.minesAroundCount !== 0) {
                if (!currCell.isShown) numOfShownCells++
                //modal
                currCell.isShown = true
                //DOM
                elNegCell.innerText = currCell.minesAroundCount
                elNegCell.classList.add('shown')

            }
            else {
                if (!currCell.isShown) {
                    numOfShownCells++
                    currCell.isShown = true
                    elNegCell.classList.add('shown')
                    expendShown(board, elCell, i, j)
                }
            }

        }
    }
    gGame.shownCount += numOfShownCells
}

function hintPress(elHint) {
    if (elHint.classList.contains('used')) return
    gIsHintPressed = true
    elHint.innerHTML = '&#x1F505'
    elHint.classList.add('used')
}

function getHint(elCell, rowIdx, colIdx) {

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            if (i === rowIdx && j === colIdx) continue
            const currCell = gBoard[i][j]
            const selector = `[data-i="${i}"][data-j="${j}"]`
            const elNegCell = document.querySelector(selector)

            if (currCell.minesAroundCount !== 0) {
                //modal
                currCell.isShown = true
                //DOM
                elNegCell.innerText = currCell.minesAroundCount
                elNegCell.classList.add('shown')

            } else {
                currCell.isShown = true
                elNegCell.classList.add('shown')
            }
        }
    }
    console.log(gBoard)

    setTimeout(() => {
        hideHint(elCell, rowIdx, colIdx)

    }, 1000);
}

function hideHint(elCell, rowIdx, colIdx) {
    gBoard[colIdx][rowIdx].isShown = false
    elCell.innerText = ''
    elCell.classList.remove('shown')

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            if (i === rowIdx && j === colIdx) continue
            const currCell = gBoard[i][j]
            const selector = `[data-i="${i}"][data-j="${j}"]`
            const elNegCell = document.querySelector(selector)

            //modal
            currCell.isShown = false
            //DOM
            elNegCell.innerText = ''
            elNegCell.classList.remove('shown')

        }
    }
    gIsHintPressed = false

}

function setTimer() {
    if (!gIsRuning) {
        gStartTime = Date.now() - elapsedTime
        gTimer = setInterval(updateTimer, 31)
        gIsRuning = true
    }

}

function updateTimer() {
    const currTime = Date.now()
    elapsedTime = currTime - gStartTime

    var hours = Math.floor(elapsedTime / (1000 * 60 * 60))
    var minutes = Math.floor(elapsedTime / (1000 * 60) % 60)
    var seconds = Math.floor(elapsedTime / 1000 % 60)
    var milSeconds = Math.floor(elapsedTime % 1000 / 10)


    hours = String(hours).padStart(2, '0')
    minutes = String(minutes).padStart(2, '0')
    seconds = String(seconds).padStart(2, '0')
    milSeconds = String(milSeconds).padStart(2, '0')

    gElTimer.innerText = `${hours}:${minutes}:${seconds}:${milSeconds}`
    gGame.secsPassed = elapsedTime / 1000
    console.log(gGame.secsPassed)

}

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}