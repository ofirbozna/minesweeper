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
var gIsMegaHintPressed = false
var gBestScore1
var gBestScoreInclock1
var gBestScore2
var gBestScoreInclock2
var gBestScore3
var gBestScoreInclock3
var gIsDarkMode = false
var gSafeClickCount = 3
var gIsMakeYourBoard = false
var gCellsShownLastClick = []




const MINE_IMG = '<img src="img/mine.png">'
const FLAG_IMG = '<img src="img/flag.png">'


//called when page loads
function onInit() {
    clearInterval(gTimer)
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
    var elRestartBtn = document.querySelector('.restart')
    elRestartBtn.innerHTML = '| &#x1F600 |'
    var elHeart = document.querySelector('.heart')
    elHeart.innerHTML = '&#x2665&#x2665&#x2665 '
    initBestScore()
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
    return gEmptyCells
}
var gMegaHintCells = []
//called when a cell is clicked
function onCellClicked(elCell, i, j) {
    // var gCellsShownLastClick = []
    if (!gGame.isOn) return
    const currCell = gBoard[i][j]
    if (currCell.isMarked) return
    if (currCell.isShown) return

    if (!gIsMakeYourBoard) {
        setTimer()
        //modal
        currCell.isShown = true
        //DOM
        elCell.classList.add('shown')
        getRandomMinesLocation(gBoard, gLevel.mines)
    } else {
        onCellClickedOnMakeYourBoard(elCell, i, j)
        return
    }

    setTheMinesNegsCount(gBoard)

    
    if (gIsHintPressed) {
        getHint(elCell, i, j)
    } else if (gIsMegaHintPressed) {
        gMegaHintCells.push({ i: i, j: j })
        if (gMegaHintCells.length === 2) {
            getMegaHint(gMegaHintCells[0], gMegaHintCells[1])
        }
        // getMegaHint()
    } else if (!gIsHintPressed && !gIsMegaHintPressed) {
        if (currCell.isMine) {
            handleMine(elCell)
            gCellsShownLastClick = [{ i: i, j: j }]
        } else if (!currCell.isMine && currCell.minesAroundCount !== 0 && currCell.isShown === true) {
            gGame.shownCount++
            //DOM
            elCell.innerText = currCell.minesAroundCount
            gCellsShownLastClick = [{ i: i, j: j }]

        } else if (currCell.minesAroundCount === 0 && currCell.isShown === true) {
            gCellsShownLastClick = [{ i: i, j: j }]
            gGame.shownCount++
            expendShown(gBoard, elCell, i, j)

        }
        checkGameOver()
    }
}

function handleMine(elCell) {
    var elHeart = document.querySelector('.heart')
    var elRestartBtn = document.querySelector('.restart')
    gLives--
    gGame.shownCount++
    if (gLives === 2) elHeart.innerHTML = '-&#x2665&#x2665 '
    if (gLives === 1) elHeart.innerHTML = '--&#x2665  '
    elCell.innerHTML = MINE_IMG
    if (gLives === 0) {
        clearInterval(gTimer)
        gGame.isOn = false
        console.log('GAME OVER')
        showMinesCells()
        elHeart.innerHTML = '---'
        elRestartBtn.innerHTML = ' | &#x1F635;&#x200D;&#x1F4AB; |'
        clearInterval(gTimer)
    }
}

// called when a cell is right clicked 
function onCellMarekd(event, elCell, i, j) {
    const currCell = gBoard[i][j]
    event.preventDefault()
    if (currCell.isShown) return
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
    var elTimer = document.querySelector('.timer')

    if (gLevel.size === 4) {
        if (gGame.secsPassed < gBestScore1) {
            gBestScore1 = gGame.secsPassed
            localStorage.bestScore1 = gBestScore1
            gBestScoreInclock1 = elTimer.innerText
            console.log(elTimer.innerText)
            localStorage.bestScoreInClock1 = gBestScoreInclock1
            var elBestScore = document.querySelector('.bestscore')
            elBestScore.innerHTML = gBestScoreInclock1
        }

    } else if (gLevel.size === 8) {
        if (gGame.secsPassed < gBestScore2) {
            gBestScore2 = gGame.secsPassed
            localStorage.bestScore2 = gBestScore2
            gBestScoreInclock2 = elTimer.innerText
            localStorage.bestScoreInClock2 = gBestScoreInclock2
            var elBestScore = document.querySelector('.bestscore')
            elBestScore.innerHTML = gBestScoreInclock2
        }

    } else if (gLevel.size === 12) {
        if (gGame.secsPassed < gBestScore3) {
            gBestScore3 = gGame.secsPassed
            localStorage.bestScore3 = gBestScore3
            gBestScoreInclock3 = elTimer.innerText
            localStorage.bestScoreInClock3 = gBestScoreInclock3
            var elBestScore = document.querySelector('.bestscore')
            elBestScore.innerHTML = gBestScoreInclock3
        }


    }

    console.log(gBestScore1)
    console.log(gBestScoreInclock1)




}


function initBestScore() {
    if (gLevel.size === 4) {
        if (localStorage.bestScore1) {
            gBestScore1 = localStorage.bestScore1
        } else {
            gBestScore1 = Infinity
            console.log(gBestScore1)
        }

        if (localStorage.bestScoreInClock1) {
            gBestScoreInclock1 = localStorage.bestScoreInClock1
        } else {
            gBestScoreInclock1 = ' '
        }
        var elBestScore = document.querySelector('.bestscore');
        elBestScore.innerHTML = gBestScore1 === Infinity ? '' : gBestScoreInclock1

    } else if (gLevel.size === 8) {
        if (localStorage.bestScore2) {
            gBestScore2 = localStorage.bestScore2
        } else {
            gBestScore2 = Infinity
        }

        if (localStorage.bestScoreInClock2) {
            gBestScoreInclock2 = localStorage.bestScoreInClock2
        } else {
            gBestScoreInclock2 = ''

        }
        var elBestScore = document.querySelector('.bestscore');
        elBestScore.innerHTML = gBestScore2 === Infinity ? '' : gBestScoreInclock2

    } else if (gLevel.size === 12) {
        if (localStorage.bestScore3) {
            gBestScore3 = localStorage.bestScore3
        } else {
            gBestScore3 = Infinity
        }

        if (localStorage.bestScoreInClock3) {
            gBestScoreInclock3 = localStorage.bestScoreInClock3
        } else {
            gBestScoreInclock3 = ''
        }
        var elBestScore = document.querySelector('.bestscore');
        elBestScore.innerHTML = gBestScore3 === Infinity ? '' : gBestScoreInclock3

    }
    console.log(gBestScore1)
}




// var elBestScore = document.querySelector('.bestScoreInClock');
// elBestScore.innerHTML = gBestScore === Infinity ? '' : gBestScore



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
                if (!currCell.isShown) {
                    numOfShownCells++
                    gCellsShownLastClick.push({ i: i, j: j })
                }
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
                    gCellsShownLastClick.push({ i: i, j: j })
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

function megaHintPress() {
    gIsMegaHintPressed = true


}

function getMegaHint(cell1, cell2) {
    if (cell1.i < cell2.i) {
        var rowIdxStart = cell1.i
        var rowIdxEnd = cell2.i
    } else {
        var rowIdxStart = cell2.i
        var rowIdxEnd = cell1.i
    }

    if (cell1.j < cell2.j) {
        var colIdxStart = cell1.j
        var colIdxEnd = cell2.j
    } else {
        var colIdxStart = cell2.j
        var colIdxEnd = cell1.j
    }

    for (var i = rowIdxStart; i <= rowIdxEnd; i++) {
        for (var j = colIdxStart; j <= colIdxEnd; j++) {
            const currCell = gBoard[i][j]
            const selector = `[data-i="${i}"][data-j="${j}"]`
            const elNegCell = document.querySelector(selector)
            currCell.isShown = true
            elNegCell.innerText = currCell.minesAroundCount
            elNegCell.classList.add('shown')

        }
    }

    setTimeout(() => {hideMegaHint(cell1,cell2)
        
    }, 2000);
}

function hideMegaHint(cell1,cell2){
    if (cell1.i < cell2.i) {
        var rowIdxStart = cell1.i
        var rowIdxEnd = cell2.i
    } else {
        var rowIdxStart = cell2.i
        var rowIdxEnd = cell1.i
    }

    if (cell1.j < cell2.j) {
        var colIdxStart = cell1.j
        var colIdxEnd = cell2.j
    } else {
        var colIdxStart = cell2.j
        var colIdxEnd = cell1.j
    }

    for (var i = rowIdxStart; i <= rowIdxEnd; i++) {
        for (var j = colIdxStart; j <= colIdxEnd; j++) {
            const currCell = gBoard[i][j]
            const selector = `[data-i="${i}"][data-j="${j}"]`
            const elNegCell = document.querySelector(selector)
            currCell.isShown = false
            elNegCell.innerText = ''
            elNegCell.classList.remove('shown')

        }
    }
    gIsMegaHintPressed = false
}


function getSafeCell() {

    if (!gIsMinesSet) return
    if (gSafeClickCount === 0) return
    var notMineLocations = getNotMineLocation(gBoard)
    var randLocation = notMineLocations[getRandomInt(0, notMineLocations.length)]
    const selector = `[data-i="${randLocation.i}"][data-j="${randLocation.j}"]`
    const elCell = document.querySelector(selector)
    elCell.classList.add('safe')
    setTimeout(() => {
        elCell.classList.remove('safe'

        )

    }, 3000);
    gSafeClickCount--

    var elSafeClick = document.querySelector('.clicks')
    elSafeClick.innerText = gSafeClickCount

}

function getNotMineLocation(board) {
    var notMineLocations = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            if (!currCell.isMine && !currCell.isShown) {
                notMineLocations.push({ i: i, j: j })
            }
        }
    }

    return notMineLocations
}


function makeYourBoard() {
    console.log('work')
    if (!gIsMakeYourBoard) {
        gIsMakeYourBoard = true
        onInit()
        gIsMinesSet = true
    } else {
        gIsMakeYourBoard = false
        var elCells = document.querySelectorAll('td')
        for (var i = 0; i < elCells.length; i++) {
            elCells[i].innerHTML = ''
        }
    }
}

function onCellClickedOnMakeYourBoard(elCell, i, j) {
    gBoard[i][j].isMine = true
    elCell.innerHTML = MINE_IMG
}

function undo() {
    console.log('hi')
    for (var i = 0; i < gCellsShownLastClick.length; i++) {
        var shownCell = gCellsShownLastClick[i]
        gBoard[shownCell.i][shownCell.j].isShown = false
        const selector = `[data-i="${shownCell.i}"][data-j="${shownCell.j}"]`
        const elCell = document.querySelector(selector)
        elCell.classList.remove('shown')
        elCell.innerHTML = ''
    }
}

function getDarkMode(elBtn) {

    if (!gIsDarkMode) {
        var elLink = document.querySelector('link')
        elLink.setAttribute('href', 'css/darkmode.css')
        elBtn.innerText = 'Light Mode'
        gIsDarkMode = true
    } else {
        var elLink = document.querySelector('link')
        elLink.setAttribute('href', 'css/style.css')
        elBtn.innerText = 'Dark Mode'
        gIsDarkMode = false

    }


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

}

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}