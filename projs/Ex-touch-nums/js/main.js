'use strict'

var gBoard
var gNums = []
var gNextNum = 1
var gNextNumDom = document.querySelector('.next')
gNextNumDom.innerHTML = gNextNum
var gIntreval
var gSeconds=0

function init() {
    fillNums(gNums)
    shuffle(gNums)
    gBoard = createBoard()
    renderBoard(gBoard)
}

function createBoard() {
    var board = []
    for (var i = 0; i < 4; i++) {
        board.push([])
        for (var j = 0; j < 4; j++) {
            board[i][j] =gNums.pop()
        }
    }
    return board
}

function renderBoard(board) {
    var strHtml = ''
    for (var i = 0; i < board.length; i++) {
        strHtml += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]
            var className = 'occupied'
            strHtml += `<td class="${className}"
            data-i="${i}" data-j="${j}" 
            onclick="cellClicked(this,${i},${j})"
            ><h3 style="color:white"> ${cell}</h3> </td>`
        }
        strHtml += '</tr>'
    }
    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHtml
}


function cellClicked(elCell, cellI, cellJ){
    console.log('elCell',elCell);
    console.log('gBoard[cellI][cellJ]',gBoard[cellI][cellJ])
    console.log('gNextNum',gNextNum)
    if(gNextNum===1){
        gIntreval = setInterval(incrementSeconds, 1000);
    }
    
    if(gBoard[cellI][cellJ]===gNextNum){
        elCell.classList.remove('occupied')
        elCell.classList.add('changeColor')
        if(gNextNum<16){
            gNextNum++
            // var el
            gNextNumDom.innerHTML = gNextNum
        }
        else if(gBoard[cellI][cellJ]===16){
            clearInterval(gIntreval)
        }
    }
}

function incrementSeconds() {
    var elTime = document.querySelector('span.time')
    gSeconds++;
    elTime.innerText = gSeconds;
}
function resetTimer(){
    var elTime = document.querySelector('span.time')
    gSeconds = 0
    elTime.innerText = gSeconds;
}

function restartGame(){
    // var clear = document.querySelector('tbody')
    // clear.innerHTML = ''
    var restartTime = document.querySelector('span.time')
    restartTime.innerText = 0
    var restartNextNum = document.querySelector('span1')
    restartNextNum.innerText = 1
    gSeconds = 0
    gNextNum = 1
    gBoard = []
    init()
}
