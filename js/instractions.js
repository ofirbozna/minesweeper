'use strict'

function showMegaHintInstractions() {
    const elInstractions = document.querySelector('.instraction')
    elInstractions.innerHTML = 'Can only be used ONCE EACH GAME <br>(1)Click the “Mega Hint” button <br>(2)Click the area’s top-left cell<br>(3)Then click bottom-right cell. <br>The whole area will be <br>revealed for 2 seconds.'
    elInstractions.style.display = 'block'
}


function hideMegaHintInstractions() {
    const elInstractions = document.querySelector('.instraction')
    elInstractions.style.display = 'none'

}


function showHintInstractions() {
    const elInstractions = document.querySelector('.instraction')
    elInstractions.innerHTML = 'press one cell to see all <br> his neighbors cells for 1 second'
    elInstractions.style.display = 'block'
}


function hideHintInstractions() {
    const elInstractions = document.querySelector('.instraction')
    elInstractions.style.display = 'none'

}


function showSafeClickInstractions() {
    const elInstractions = document.querySelector('.instraction')
    elInstractions.innerHTML = 'press to see <br> one safe  (not mine) cell'
    elInstractions.style.display = 'block'
}


function hideSafeClickInstractions() {
    const elInstractions = document.querySelector('.instraction')
    elInstractions.style.display = 'none'

}


function showMakeYourBoardInstractions() {
    const elInstractions = document.querySelector('.instraction')
    elInstractions.innerHTML = '(1)press button <br>(2)locte the mines on the board <br> (3)press the button again <br>(4)play'
    elInstractions.style.display = 'block'
}


function hideMakeYourBoardInstractions() {
    const elInstractions = document.querySelector('.instraction')
    elInstractions.style.display = 'none'

}


function showRestartInstractions() {
    const elInstractions = document.querySelector('.instraction')
    elInstractions.innerHTML = 'Restart'
    elInstractions.style.display = 'block'
}


function hideRestartInstractions() {
    const elInstractions = document.querySelector('.instraction')
    elInstractions.style.display = 'none'

}


function showUndoInstractions() {
    const elInstractions = document.querySelector('.instraction')
    elInstractions.innerHTML = 'Go back one step, you will <br> get back life only on medium <br> and expert levels. you will <br>not get back hints.'
    elInstractions.style.display = 'block'
}


function hideUndoInstractions() {
    const elInstractions = document.querySelector('.instraction')
    elInstractions.style.display = 'none'

}
