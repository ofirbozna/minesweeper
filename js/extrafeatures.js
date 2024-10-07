'use strict'

var gIsHintPressed = false
var gIsMegaHintPressed = false
var gMegaHintCells = []
var gSafeClickCount = 3
var gIsMakeYourBoard = false
var gMegaHintCount = 1


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

            if (currCell.isMine) {
                elNegCell.innerHTML = MINE_IMG
                elNegCell.classList.add('shown')
            } else if (currCell.minesAroundCount !== 0) {
                elNegCell.innerText = currCell.minesAroundCount
                elNegCell.classList.add('shown')
            } else {
                elNegCell.classList.add('shown')
            }
        }
    }
    setTimeout(() => {
        hideHint(elCell, rowIdx, colIdx)

    }, 1000);
}


function hideHint(elCell, rowIdx, colIdx) {
    gBoard[rowIdx][colIdx].isShown = false
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

            if (!currCell.isShown) {
                elNegCell.innerText = ''
                elNegCell.classList.remove('shown')
            }
        }
    }
    gIsHintPressed = false

}


function restartHints() {
    var elHints = document.querySelectorAll('.hint')
    for (var i = 0; i < elHints.length; i++) {
        elHints[i].innerHTML = '&#x1F4A1'
        elHints[i].classList.remove('used')
    }
}


function megaHintPress() {
    if (gMegaHintCount === 0) {
        var elMegaHint = document.querySelector('.mega-hint-txt')
        elMegaHint.innerHTML += '<strong><br>Can Not <br>Be used <br>Again!</strong>'
        elMegaHint.classList.add('used')

        setTimeout(() => {
            elMegaHint.innerHTML = 'Mega Hint'
            elMegaHint.classList.remove('used-mega')

        }, 2000);
        return
    }

    gIsMegaHintPressed = true
    gMegaHintCount--


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
            elNegCell.classList.add('shown')
            if (currCell.isMine) {
                elNegCell.innerHTML = MINE_IMG
            } else if (currCell.minesAroundCount !== 0) {
                elNegCell.innerText = currCell.minesAroundCount
            } else {
                elNegCell.innerText = ''
            }
            setTimeout(() => {
                if (!currCell.isShown) {
                    elNegCell.innerText = ''
                    elNegCell.classList.remove('shown')
                }
            }, 2000);
        }
    }
    gIsMegaHintPressed = false
    gMegaHintCells = []
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

    }, 1000);
    gSafeClickCount--
    var elSafeClick = document.querySelector('.clicks')
    elSafeClick.innerText = gSafeClickCount

}


function makeYourBoard() {
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
    for (var i = 0; i < gCellsShownLastClick.length; i++) {
        var shownCell = gCellsShownLastClick[i]
        gBoard[shownCell.i][shownCell.j].isShown = false
        const selector = `[data-i="${shownCell.i}"][data-j="${shownCell.j}"]`
        const elCell = document.querySelector(selector)
        elCell.classList.remove('shown')
        elCell.innerHTML = ''
        if (gBoard[shownCell.i][shownCell.j].isMine&& gMinesLeftCount< gLevel.mines) {
            gMinesLeftCount++
            var elMines = document.querySelector('.mines-count')
            elMines.innerText = gMinesLeftCount
            if (gLevel.mines > 3) {
                var elHeart = document.querySelector('.heart')
                if (gLives === 2) {
                    gLives++
                    elHeart.innerHTML = '&#x2665&#x2665&#x2665 '
                } else if (gLives === 1) {
                    gLives++
                    elHeart.innerHTML = '- &#x2665&#x2665  '
                } else if (gLives === 0) return
            }
        }
    }
}