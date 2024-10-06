'use strict'

var gBestScore1
var gBestScoreInclock1
var gBestScore2
var gBestScoreInclock2
var gBestScore3
var gBestScoreInclock3


function checkBestScore() {
    var elTimer = document.querySelector('.timer')

    if (gLevel.size === 4) {
        if (gGame.secsPassed < gBestScore1) {
            gBestScore1 = gGame.secsPassed
            localStorage.bestScore1 = gBestScore1
            gBestScoreInclock1 = elTimer.innerText
            console.log(elTimer.innerText)
            localStorage.bestScoreInClock1 = gBestScoreInclock1
            var elBestScore = document.querySelector('.best-score')
            elBestScore.innerHTML = gBestScoreInclock1
        }

    } else if (gLevel.size === 8) {
        if (gGame.secsPassed < gBestScore2) {
            gBestScore2 = gGame.secsPassed
            localStorage.bestScore2 = gBestScore2
            gBestScoreInclock2 = elTimer.innerText
            localStorage.bestScoreInClock2 = gBestScoreInclock2
            var elBestScore = document.querySelector('.best-score')
            elBestScore.innerHTML = gBestScoreInclock2
        }

    } else if (gLevel.size === 12) {
        if (gGame.secsPassed < gBestScore3) {
            gBestScore3 = gGame.secsPassed
            localStorage.bestScore3 = gBestScore3
            gBestScoreInclock3 = elTimer.innerText
            localStorage.bestScoreInClock3 = gBestScoreInclock3
            var elBestScore = document.querySelector('.best-score')
            elBestScore.innerHTML = gBestScoreInclock3
        }
    }
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
        var elBestScore = document.querySelector('.best-score');
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
        var elBestScore = document.querySelector('.best-score');
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
        var elBestScore = document.querySelector('.best-score');
        elBestScore.innerHTML = gBestScore3 === Infinity ? '' : gBestScoreInclock3

    }
}