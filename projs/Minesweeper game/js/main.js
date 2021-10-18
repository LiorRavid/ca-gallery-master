'use strict'

const MINE = '💣'
const FLAG = '🚩'
const NORMAL = '😃'
const LIFE = '😑'
const LOSE = '🤯'
const WIN = '😎'

var gBoard

var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gGame = {
    isOn:false,
    shownCount: 0,
    markedCount: 0,
}

var gInterval
var gTimeOut
var gLevelName
var isFirstClick
var gLivesCount = 2
var gSafeAvailable = 3
var isSevenBoom

function chooseLevel(elBtn) {
    var level = elBtn.innerText
    if (level === 'Beginner') {
        gLevel.SIZE = 4
        gLevel.MINES = 2
        gLivesCount = 2
    } else if (level === 'Medium') {
        gLevel.SIZE = 8
        gLevel.MINES = 12
        gLivesCount = 3
    } else {
        gLevel.SIZE = 12
        gLevel.MINES = 30
        gLivesCount = 3
    }
    restartGame()
}

function init() {
    isFirstClick = true
    isSevenBoom = false
    renderNewTimer()
    renderSmiley(NORMAL)
    renderSafeClick()
    gGame.shownCount = 0
    gGame.markedCount = 0
    gBoard = buildBoard(gLevel.SIZE)
    renderBoard(gBoard)
}

// create object in cell
function createCell() {
    var cell = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
        value: ''
    }
    return cell
}

// add random mines in the model
function addRandomMine(board, mines, cellI, cellJ) {
    var cells = getCells(board)
    while (mines > 0) {
        var idx = getRandomCell(cells)
        var cell = cells[idx]
        if (cell.i === cellI && cell.j === cellJ) {
            continue
        } else {
            board[cell.i][cell.j].value = MINE
            board[cell.i][cell.j].isMine = true
            cells.splice(idx, 1)
            mines--
        }
    }
}


// Render the board as a <table> to the page
function renderBoard(board) {
    var strHtml = ''
    for (var i = 0; i < board.length; i++) {
        strHtml += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j];
            strHtml += `<td class="hide" data-i="${i}" data-j="${j}"
            oncontextmenu ="cellMarked(event,${i},${j})" onclick="cellClicked(${i},${j})"
            ><span hidden>${cell.value}</span></td>`
        }
        strHtml += '</tr>'
    }
    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHtml
}

// Count mines around each cell and set the cell's minesAroundCount
function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var negsCount = countNeighbors(i, j, board)
            if (!board[i][j].isMine && negsCount > 0) {
                board[i][j].value = negsCount
                board[i][j].minesAroundCount = negsCount
            }
        }
    }
    return board
}

// Called when a cell (td) is clicked elCell
function cellClicked(cellI, cellJ) {
    if (isFirstClick) {
        if (!isSevenBoom) {
            addRandomMine(gBoard, gLevel.MINES, cellI, cellJ)
            gBoard = setMinesNegsCount(gBoard)
            renderBoard(gBoard)
        }
        gGame.isOn = true
        isFirstClick = false
        startTimer()
    }
    if (checkIfFlag(cellI, cellJ)) return
    if (gBoard[cellI][cellJ].value !== MINE) {
        gBoard[cellI][cellJ].isShown = true
        var negsCount = countNeighbors(cellI, cellJ, gBoard)
        if (negsCount === 0) {
            expandShown(cellI, cellJ, gBoard)
            checkVictory()
        } else {
            gGame.shownCount++
            showCellValue(cellI, cellJ)
            checkVictory()
        }
    } else {
        gLivesCount--
        showCellValue(cellI, cellJ)
        renderNewLives()
        renderSmiley(LIFE)
        if (gLivesCount === 0) {
            revealMines()
            renderSmiley(LOSE)
            gameOver()
        }
    }
}

// Called on right click to mark a cell (suspected to be a mine)
function cellMarked(event, cellI, cellJ) {
    if (isFirstClick) {
        if (!isSevenBoom) {
            addRandomMine(gBoard, gLevel.MINES, cellI, cellJ)
            gBoard = setMinesNegsCount(gBoard)
            renderBoard(gBoard)
        }
        gGame.isOn = true
        isFirstClick = false
        startTimer()
    }
    if (checkIfFlag(cellI, cellJ)) {
        hideCellValue(cellI, cellJ)
        gBoard[cellI][cellJ].isMarked = false
        renderCell(cellI, cellJ, gBoard[cellI][cellJ].value)
        gGame.markedCount--
    } else {
        var elCell = document.querySelector(`[data-i="${cellI}"][data-j="${cellJ}"] span`)
        elCell.innerText = FLAG
        showCellValue(cellI, cellJ)
        gBoard[cellI][cellJ].isMarked = true
        gGame.markedCount++
        checkVictory()
    }
}

// show the value in the cell
function showCellValue(cellI, cellJ) {
    var elCell = document.querySelector(`[data-i="${cellI}"][data-j="${cellJ}"]`)
    var elCellTxt = document.querySelector(`[data-i="${cellI}"][data-j="${cellJ}"] span`)
    elCellTxt.hidden = false
    if (elCellTxt.innerText === FLAG) {
        return
    } else {
        elCell.classList.remove('hide')
        elCell.classList.add('noClick')
    }
}

// When user clicks a cell with no mines around,show not only that cell, but also its neighbors
function expandShown(cellI, cellJ, board) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            if (i === cellI && j === cellJ) gGame.shownCount++
            if (board[i][j].isShown) {
                showCellValue(i, j)
                continue
            }
            showCellValue(i, j)
            board[i][j].isShown = true
            gGame.shownCount++
        }
    }
}

// hide cell value
function hideCellValue(cellI, cellJ) {
    document.querySelector(`[data-i="${cellI}"][data-j="${cellJ}"] span`).hidden = true
}

// check if there already a flag in the cell
function checkIfFlag(cellI, cellJ) {
    var elCell = document.querySelector(`[data-i="${cellI}"][data-j="${cellJ}"] span`)
    return (elCell.innerText === FLAG)
}

// reveal all the mines on the board
function revealMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].value === MINE) {
                renderCell(i, j, gBoard[i][j].value)
                showCellValue(i, j)
            }
        }
    }
}


// check if the gamer wins
function checkVictory() {
    if(isSevenBoom){
        checkBoomVictory()
    }else{
        var length = gBoard.length
        if (length === 4) {
            if (gGame.shownCount === 14 && gGame.markedCount === 2) {
                renderSmiley(WIN)
                gameOver()
                return
            }
        }
        if (length === 8) {
            if (gGame.shownCount === 52 && gGame.markedCount === 12) {
                renderSmiley(WIN)
                gameOver()
                return
            }
        }
        if (length === 12) {
            if (gGame.shownCount === 114 && gGame.markedCount === 30) {
                renderSmiley(WIN)
                gameOver()
                return
            }
        } else {
            return
        }
    }
}


function gameOver() {
    stopTimer()
    disableClick()
    clearTimeout(gTimeOut)
}


function restartGame() {
    gameOver()
    enableClick()
    renderSmiley(NORMAL)
    resetGameLevel()
    gGame.isOn = false
    init()
}

function resetGameLevel() {
    if (gLevel.SIZE === 4) {
        gLivesCount = 2
    } else if (gLevel.SIZE === 8) {
        gLivesCount = 3
    } else if (gLevel.SIZE === 12) {
        gLivesCount = 3
    }
    renderNewLives()
}

// render cell in the DOM
function renderCell(i, j, value) {
    var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"] span`)
    elCell.innerText = value
}

// render the smily button
function renderSmiley(smiley) {
    document.querySelector('button span').innerText = smiley
}

// set the lives in start position
function renderNewLives() {
    var elLives = document.querySelector(".LIVES h3 span")
    elLives.innerText = gLivesCount
}

// set the timer in start position
function renderNewTimer() {
    var elTimer = document.querySelector(".timer h3 span")
    elTimer.innerText = ''
}

// disable click on any cell in the matrix
function disableClick() {
    var elTable = document.querySelector('tbody')
    elTable.classList.add('noClick')
}

// enable click on any cell in the matrix
function enableClick() {
    var elTable = document.querySelector('tbody')
    elTable.classList.remove('noClick')
}


// ###############################################BONOUS#####################################################

// set mines with 7 Boom principels
function sevenBoomMines() {
    restartGame()
    var cells = getCells(gBoard)
    var cellI
    var cellJ
    for (var i = 0; i < cells.length; i++) {
        cellI = cells[i].i
        cellJ = cells[i].j
        if (i === 0 || i === 7) {
            gBoard[cellI][cellJ].value = MINE
            gBoard[cellI][cellJ].isMine = true
        } else if (i > 10) {
            var unit = parseInt(i / 10)
            var dozen = i % 10
            var mult = i % 7
            if (unit === 7 || dozen === 7 || mult === 0) {
                gBoard[cellI][cellJ].value = MINE
                gBoard[cellI][cellJ].isMine = true
            }

        }
    }
    setMinesNegsCount(gBoard)
    isSevenBoom = true
    renderBoard(gBoard)
}

// check victory forr seven boom option
function checkBoomVictory(){
    var length = gBoard.length
    if (length === 4) {
        if (gGame.shownCount === 13 && gGame.markedCount === 3) {
            renderSmiley(WIN)
            gameOver()
            return
        }
    }
    if (length === 8) {
        if (gGame.shownCount === 49 && gGame.markedCount === 15) {
            renderSmiley(WIN)
            gameOver()
            return
        }
    }
    if (length === 12) {
        if (gGame.shownCount === 103 && gGame.markedCount === 41) {
            renderSmiley(WIN)
            gameOver()
            return
        }
    }else {
        return
    }
}


//mark a random covered cell (for a few seconds) that is safe to click
function safeClick() {
    if(!gGame.isOn)return
    if (gSafeAvailable ===0)return
    var safeCells = getSafeCells(gBoard)
    var randIdx = getRandomCell(safeCells)
    var cellI =safeCells[randIdx].i
    var cellJ =safeCells[randIdx].j
    var elCell = document.querySelector(`[data-i="${cellI}"][data-j="${cellJ}"]`)
    elCell.classList.add('markCell')
    gTimeOut = setTimeout(function(){
        elCell.classList.remove('markCell')
    },3000)
    var clicksAvailable = document.querySelector('.clicksAvailable span')
    clicksAvailable.innerText = --gSafeAvailable 
}

// get a random cell that is not shown yet and not a mine
function getSafeCells(board) {
    var cells = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cellValue = board[i][j].value
            var cellIsShown = board[i][j].isShown
            if (cellValue !== '' && cellValue !== board[i][j].minesAroundCount) continue
            if(cellIsShown)continue
            var cell = { i: i, j: j }
            cells.push(cell)
        }
    }
    return cells
}

// reset the safe click with 3
function renderSafeClick(){
    gSafeAvailable=3
    var clicksAvailable = document.querySelector('.clicksAvailable span')
    clicksAvailable.innerText = gSafeAvailable 
}


