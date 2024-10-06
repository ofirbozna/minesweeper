'use strict'

var gTimer
var gStartTime = 0
var elapsedTime = 0
var gIsRuning = false
var gElTimer = document.querySelector('.timer')
gElTimer.innerText = '00:00:00:00'

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


function resetTimer(){
    gStartTime = 0
    elapsedTime = 0
    gIsRuning = false
    gElTimer.innerText = '00:00:00:00'
    var elRestartBtn = document.querySelector('.restart')
}