'use strict'

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
var gIsDarkMode = false
var gCellsShownLastClick = []

const MINE_IMG = '<img src="img/mine.png">'
const FLAG_IMG = '<img src="img/flag.png">'


function onInit() {
    clearInterval(gTimer)
    gGame.isOn = true
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    gLives = 3
    gBoard = buildBoard()
    renderBoard(gBoard)
    resetTimer()
    gIsMinesSet = false
    gMegaHintCount = 1
    var elRestartBtn = document.querySelector('.restart')
    elRestartBtn.innerHTML = '&#x1F600'
    var elHeart = document.querySelector('.heart')
    elHeart.innerHTML = '&#x2665&#x2665&#x2665 '
    initBestScore()
    restartHints()
}


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
        location.isMine = true
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


function onCellClicked(elCell, i, j) {
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
        currCell.isShown = false
        gMegaHintCells.push({ i: i, j: j })
        if (gMegaHintCells.length === 2) {
            getMegaHint(gMegaHintCells[0], gMegaHintCells[1])
        }
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
    if (gLives === 2) elHeart.innerHTML = '- &#x2665&#x2665 '
    if (gLives === 1) elHeart.innerHTML = '- - &#x2665  '
    elCell.innerHTML = MINE_IMG
    if (gLives === 0) {
        clearInterval(gTimer)
        gGame.isOn = false
        showMinesCells()
        elHeart.innerHTML = '- - -'
        elRestartBtn.innerHTML = ' &#x1F635;&#x200D;&#x1F4AB; '
        clearInterval(gTimer)
    }
}


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


function showMinesCells() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            const currCell = gBoard[i][j]
            if (currCell.isMine) {
                const selector = `[data-i="${i}"][data-j="${j}"]`
                const elCell = document.querySelector(selector)
                elCell.innerHTML = MINE_IMG
            }
        }
    }
}


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


