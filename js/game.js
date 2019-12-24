let levels = [{ name: 'easy', grid: 4 }, { name: 'pro', grid: 5 }];
let currentLevel = levels[0];
let numCols;
let numRows;
let totalCells;
let cells;
let totalCellsOn;
let score;
const stageElement = document.getElementsByClassName('stage')[0];
const boardElement = document.getElementsByClassName('board')[0];
const dialogElement = document.getElementsByClassName('dialog')[0];
let currentModal;

function setStage() {
    let screenW = window.innerWidth;
    let screenH = window.innerHeight;
    let diagonal = Math.sqrt(screenW * screenW + screenH * screenH);
    document.documentElement.style.setProperty('--stageSize', diagonal + 'px');
}

const initGame = () => {
    //set gridSizes
    initLevel(currentLevel);
    //set cells
    for (let i = 0; i < totalCells; i++) {
        cells[i] = {
            element: document.getElementById('cell' + i),
            order: i,
        };
        cells[i].element.addEventListener('click', cellClick, false);

    }

    //reset game
    resetGame();
    //remove Modal
    modalHide();
}

const initLevel = (level) => {
    numCols = level.grid;
    numRows = level.grid;
    totalCells = numCols * numRows;
    cells = [numRows]
    //hide all divs
    if (!!stageElement) {
        stageElement.classList.remove('spinning');
    }
    hideAllCells();
}
const resetGame = () => {
    //reset score
    score = 0;
    updateScore(0);
    //disable all Chekboxes
    for (let i = 0; i < totalCells; i++) {
        cells[i].element.checked = false;
    }


}
const hideAllCells = () => {
    document.documentElement.style.setProperty('--gridSize', currentLevel.grid);
    let cells = document.getElementsByClassName('cell');
    //hide all the cells
    for (let i =
        0; i < cells.length; i++) {
        let elem = cells[i];
        elem.classList.add('isHidden');
    }
    //show only the needed ones
    for (let i =
        0; i < totalCells; i++) {
        let elem = cells[i];
        elem.classList.toggle('isHidden');
    }
}

const initGrid = () => {
    document.documentElement.style.setProperty('--gridSize', currentLevel.grid);
    for (let i = 0; i < cells.length; i++) {
        let elem = cells[i];
        elem.classList.toggle('isHidden');
    }
}

function cellClick() {
    let index = parseInt(this.dataset.index);
    toggleNeighbours(index);
    countTotalCells();
    score++;
    updateScore(score);
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
    for (let prop in neighbours) {
        updateCheckStatus(neighbours, prop);
    }
}

const countTotalCells = () => {
    totalCellsOn = cells.filter(cell => cell.element.checked).length;
    (totalCellsOn === totalCells) && endGame();
}

const updateScore = (num = 0) => {

    const scoreBoard = document.getElementsByClassName('score')[0];
    if (!!scoreBoard) {
        scoreBoard.innerHTML = num;
    }
}

function endGame() {
    // make the wheel spin
    if (!!stageElement) {
        stageElement.classList.add('spinning');
    }
    // const board
    if (!!boardElement) {
        stageElement.classList.add('blinking');
    }
    //remove clicks
    for (let i = 0; i < totalCells; i++) {
        cells[i].element.removeEventListener('click', cellClick);
    }
    //levelUP
    let upgradeInterval = setTimeout(upgradeLevel, 5000);

}

const upgradeLevel = () => {
    (currentLevel === levels[0]) && (currentLevel = levels[1]);
    // resetGame();
    //update the modals
    currentModal = document.getElementById('modal-levelUp');
    currentModal.classList.toggle('isHidden');
    //let people see
    modalShow();
}
function updateCheckStatus(neighbours, prop) {
    let isChecked = cells[neighbours[prop]].element.checked;
    cells[neighbours[prop]].element.checked = !isChecked;

}

const modalHide = () => {
    currentModal = document.getElementsByClassName('a-swipeDown')[0];
    if (!!currentModal) {
        currentModal.classList.toggle('a-swipeDown');
        currentModal.classList.add('a-swipeUp');
        let modalInterval = setTimeout(function () {
            dialogElement.classList.toggle('a-fadeOut');
            currentModal.classList.toggle('isHidden');
            currentModal.classList.remove('a-swipeUp');
            let overlayInterval = setTimeout(function () {
                dialogElement.classList.toggle('isHidden');
            }, 500);
        }, 1000);
    }
}

const modalShow = () => {
    dialogElement.classList.toggle('a-fadeOut');
    dialogElement.classList.toggle('isHidden'); dialogElement.classList.toggle('a-fadeIn');
    currentModal.classList.toggle('a-swipeDown');

}