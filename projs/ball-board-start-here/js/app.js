var WALL = 'WALL';
var FLOOR = 'FLOOR';
var BALL = 'BALL';
var GAMER = 'GAMER';
var GLUE = 'GLUE';

var GAMER_IMG = '<img src="img/gamer.png" />';
var BALL_IMG = '<img src="img/ball.png" />';
var GLUE_IMG = '<img src="img/candy.png" />';

var gBoard;
var gGamerPos;
var gNumsBallCollect = 0
var gInterval
var gIntervalGlue 
var gPos

function initGame() {
	gGamerPos = { i: 2, j: 9 };
	gBoard = buildBoard();
	renderBoard(gBoard);
	gInterval = setInterval(addRandomBall,3000)
	gIntervalGlue =setInterval(addRandomGlue,5000)
}

function buildBoard() {
	// Create the Matrix
	var board = createMat(10, 12)


	// Put FLOOR everywhere and WALL at edges
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {
			// Put FLOOR in a regular cell
			var cell = { type: FLOOR, gameElement: null };

			// Place Walls at edges
			if (i === 0 || i === board.length - 1 || j === 0 || j === board[0].length - 1) {
				cell.type = WALL;
			}

			// Add created cell to The game board
			board[i][j] = cell;
		}
	}
	// place the passages 
	cell={ type: FLOOR, gameElement: null }
	board[0][5] = cell
	board[5][0] = cell
	board[5][11] = cell
	board[9][5] = cell
	

	// Place the gamer at selected position
	board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;

	// Place the Balls (currently randomly chosen positions)
	board[3][8].gameElement = BALL;
	board[7][4].gameElement = BALL;

	console.log(board);
	return board;
}

// Render the board to an HTML table
function renderBoard(board) {

	var strHTML = '';
	for (var i = 0; i < board.length; i++) {
		strHTML += '<tr>\n';
		for (var j = 0; j < board[0].length; j++) {
			var currCell = board[i][j];

			var cellClass = getClassName({ i: i, j: j })

			// TODO - change to short if statement
			if (currCell.type === FLOOR) cellClass += ' floor';
			else if (currCell.type === WALL) cellClass += ' wall';

			//TODO - Change To template string
			strHTML += '<td class="cell ' + cellClass +
				'"  onclick="moveTo(' + i + ',' + j + ')" >\n';

			// TODO - change to switch case statement
			if (currCell.gameElement === GAMER) {
				strHTML += GAMER_IMG;
			} else if (currCell.gameElement === BALL) {
				strHTML += BALL_IMG;
			}

			strHTML += '</td>\n';
		}
		strHTML += '</tr>\n';
	}

	console.log('strHTML is:');
	console.log(strHTML);
	var elBoard = document.querySelector('.board');
	elBoard.innerHTML = strHTML;
}

// Move the player to a specific location
function moveTo(i, j) {
	var targetCell = gBoard[i][j];
	if (targetCell.type === WALL) return;

	// Calculate distance to make sure we are moving to a neighbor cell
	var iAbsDiff = Math.abs(i - gGamerPos.i);
	var jAbsDiff = Math.abs(j - gGamerPos.j);

	// If the clicked Cell is one of the four allowed
	if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0)) {

		if (targetCell.gameElement === BALL) {
			gNumsBallCollect++
			var elBallsNum = document.querySelector('.ballsNum h2 span')
			elBallsNum.innerHTML = gNumsBallCollect
			var audio = document.querySelector('audio')
			audio.play()
		}

		// if (targetCell.gameElement === GLUE) {
		// 	gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
		// 	renderCell(gGamerPos, '');
		// 	gGamerPos.i = i;
		// 	gGamerPos.j = j;
		// 	gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
		// 	renderCell(gGamerPos, GAMER_IMG);
		// }

		// MOVING from current position
		// Model:
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
		// Dom:
		renderCell(gGamerPos, '');

		// MOVING to selected position
		// Model:
		gGamerPos.i = i;
		gGamerPos.j = j;
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
		// DOM:
		renderCell(gGamerPos, GAMER_IMG);

	} // else console.log('TOO FAR', iAbsDiff, jAbsDiff);

}

// move player through passages
function moveToPassage(i, j) {
	var targetCell = gBoard[i][j];
	if (targetCell.type === WALL) return;

	// Calculate distance to make sure we are moving to a neighbor cell
	var iAbsDiff = Math.abs(i - gGamerPos.i);
	var jAbsDiff = Math.abs(j - gGamerPos.j);

	// If the clicked Cell is one of the four allowed
	if ((iAbsDiff === 9 && jAbsDiff === 0) || (jAbsDiff === 11 && iAbsDiff === 0)) {

		if (targetCell.gameElement === BALL) {
			gNumsBallCollect++
			var elBallsNum = document.querySelector('.ballsNum h2 span')
			elBallsNum.innerHTML = gNumsBallCollect
			var audio = document.querySelector('audio')
			audio.play()
		}

		// MOVING from current position
		// Model:
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
		// Dom:
		renderCell(gGamerPos, '');

		// MOVING to selected position
		// Model:
		gGamerPos.i = i;
		gGamerPos.j = j;
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
		// DOM:
		renderCell(gGamerPos, GAMER_IMG);

	}
}	

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
	var cellSelector = '.' + getClassName(location)
	var elCell = document.querySelector(cellSelector);
	elCell.innerHTML = value;
}

// Move the player by keyboard arrows
function handleKey(event) {
	var i = gGamerPos.i;
	var j = gGamerPos.j;


	switch (event.key) {
		case 'ArrowLeft':
			if(i===5 && j===0){
				moveToPassage(5,11)
				break
			}
			moveTo(i, j - 1);
			break;
		case 'ArrowRight':
			if(i===5 && j===11){
				moveToPassage(5,0)
				break
			}
			moveTo(i, j + 1);
			break;
		case 'ArrowUp':
			if(i===0 && j===5){
				moveToPassage(9,5)
				break
			}
			moveTo(i - 1, j);
			break;
		case 'ArrowDown':
			if(i===9 && j===5){
				moveToPassage(0,5)
				break
			}
			moveTo(i + 1, j);
			break;

	}

}

// Returns the class name for a specific cell
function getClassName(location) {
	var cellClass = 'cell-' + location.i + '-' + location.j;
	return cellClass;
}

function isEmptyCell(coord) {
    return(coord.type===FLOOR && coord.gameElement ===null)
}

function getEmpthyCells(board){
	var empthyCells = []
	for(var i=0;i<board.length;i++){
		for(var j=0;j<board[i].length;j++){
			var pos = {i:i,j:j}
			if(isEmptyCell(board[i][j]))empthyCells.push(pos)
		}
	}
	return empthyCells
}

function getRandomEmpthyCell(){
	var empthyCells = getEmpthyCells(gBoard)
	// console.log('empthyCells',empthyCells)
	var randIdx = getRandomInt(0,empthyCells.length-1)
	// console.log('randomCell',randomCell)
	return empthyCells[randIdx]
	
}

function renderBall(pos){
	// model:
	gBoard[pos.i][pos.j].gameElement = BALL;
	// DOM:
		renderCell(pos, BALL_IMG);
}


function addRandomBall(){
	var empthyCells = getEmpthyCells(gBoard)
	if(empthyCells.length===83){
		clearInterval(gInterval)
		clearInterval(gIntervalGlue)
		var elRestart = document.querySelector('button')
		elRestart.style.display='block'		
	}else{
		var pos = getRandomEmpthyCell()
		renderBall(pos)
	}
}

function restartGame(){
	gNumsBallCollect = 0
	var elBallsNum = document.querySelector('.ballsNum h2 span')
	elBallsNum.innerHTML = gNumsBallCollect
	var elRestart = document.querySelector('button')
	elRestart.style.display='none'	
	initGame()
}

function renderGlue(pos){
	// model:
	gBoard[pos.i][pos.j].gameElement = GLUE;
	// DOM:
		renderCell(pos, GLUE_IMG);
}

function addRandomGlue(){	
	var pos = getRandomEmpthyCell()
	gPos = pos
	renderGlue(pos)
	setTimeout(clearGlue,3000)
}

function clearGlue(){
	gBoard[gPos.i][gPos.j].gameElement = null;
	renderCell(gPos,'');
}

// function toggle(){
// 	var isGlue = false
// 	if (gBoard[gPos.i][gPos.j].gameElement = GLUE){
// 		isGlue=True
// 	}	
// }

