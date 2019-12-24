let levels = [{ name: 'easy', grid: 4 }, { name: 'pro', grid: 5 }];
let currentLevel;
let numCols;
let numRows;
let totalCells;
let cells;
let totalCellsOn;
let score;

const initGame = () => {
    //set gridSizes
    currentLevel = levels[1];
    initLevel(currentLevel);
    //set cells
    for (let i = 0; i < totalCells; i++) {
        cells[i] = {
            element: document.getElementById('cell' + i),
            order: i,
        };
        cells[i].element.addEventListener('click', cellClick, false);

    }
    //hide all divs
    document.getElementsByClassName('cell').classList.add('isHidden');
    //initGrid
    initGrid();
    //reset score
    score = 0;


}
const initLevel = (level) => {
    console.log(level.grid);
    numCols = level.grid;
    numRows = level.grid;
    totalCells = numCols * numRows;
    cells = [numRows]
}
const initGrid = () => {
    document.documentElement.style.setProperty('--gridSize', currentLevel.grid);
    for (cell in cells) {
        console.log(cell);
    }
}
function cellClick() {
    let index = parseInt(this.dataset.index);
    toggleNeighbours(index);
    countTotalCells();
    updateScore();
}

const findNeighbours = (index) => {
    let result = {
        t: (index < numCols) ? null : index - numCols,
        b: ((index + numCols) >= totalCells) ? null : index + numCols,
        l: ((index % numCols) === 0) ? null : index - 1,
        r: ((index % numCols) === (numCols - 1)) ? null : index + 1
    }
    return {
        ...((!!result.t || result.t === 0) && { t: result.t }),
        ...((!!result.b || result.b === 0) && { b: result.b }),
        ...((!!result.l || result.l === 0) && { l: result.l }),
        ...((!!result.r || result.r === 0) && { r: result.r }),
    };
}

const toggleNeighbours = (index) => {

    let neighbours = findNeighbours(index);
    console.log(index, neighbours);
    for (let prop in neighbours) {
        updateCheckStatus(neighbours, prop);
    }
}

const countTotalCells = () => {
    totalCellsOn = cells.filter(cell => cell.element.checked).length;
    (totalCellsOn === totalCells) ? endGame() : undefined;
}

const updateScore = () => {
    score++;
    const scoreBoard = document.getElementsByClassName('score')[0];
    if (!!scoreBoard) {
        scoreBoard.innerHTML = score;
    }
}

function endGame() {
    const stage = document.getElementsByClassName('stage')[0];
    if (!!stage) {
        stage.classList.add('spinning');
    }
}

function updateCheckStatus(neighbours, prop) {
    let isChecked = cells[neighbours[prop]].element.checked;
    cells[neighbours[prop]].element.checked = !isChecked;
}
