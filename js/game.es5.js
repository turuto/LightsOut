'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var levels = [{ name: 'easy', grid: 4 }, { name: 'pro', grid: 5 }];
var currentLevel = levels[0];
var numCols = void 0;
var numRows = void 0;
var totalCells = void 0;
var cells = void 0;
var totalCellsOn = void 0;
var score = void 0;
var stageElement = document.getElementsByClassName('stage')[0];
var boardElement = document.getElementsByClassName('board')[0];
var dialogElement = document.getElementsByClassName('dialog')[0];
var currentModal = void 0;

function setStage() {
    var screenW = window.innerWidth;
    var screenH = window.innerHeight;
    var diagonal = Math.sqrt(screenW * screenW + screenH * screenH);
    document.documentElement.style.setProperty('--stageSize', diagonal + 'px');
}

var initGame = function initGame() {
    //set gridSizes
    initLevel(currentLevel);
    //set cells
    for (var i = 0; i < totalCells; i++) {
        cells[i] = {
            element: document.getElementById('cell' + i),
            order: i
        };
        cells[i].element.addEventListener('click', cellClick, false);
    }

    //reset game
    resetGame();
    //remove Modal
    modalHide();
};

var initLevel = function initLevel(level) {
    numCols = level.grid;
    numRows = level.grid;
    totalCells = numCols * numRows;
    cells = [numRows];
    //hide all divs
    if (!!stageElement) {
        stageElement.classList.remove('spinning');
    }
    hideAllCells();
};
var resetGame = function resetGame() {
    //reset score
    score = 0;
    updateScore(0);
    //disable all Chekboxes
    for (var i = 0; i < totalCells; i++) {
        cells[i].element.checked = false;
    }
};
var hideAllCells = function hideAllCells() {
    document.documentElement.style.setProperty('--gridSize', currentLevel.grid);
    var cells = document.getElementsByClassName('cell');
    //hide all the cells
    for (var i = 0; i < cells.length; i++) {
        var elem = cells[i];
        elem.classList.add('isHidden');
    }
    //show only the needed ones
    for (var _i = 0; _i < totalCells; _i++) {
        var _elem = cells[_i];
        _elem.classList.toggle('isHidden');
    }
};

var initGrid = function initGrid() {
    document.documentElement.style.setProperty('--gridSize', currentLevel.grid);
    for (var i = 0; i < cells.length; i++) {
        var elem = cells[i];
        elem.classList.toggle('isHidden');
    }
};

function cellClick() {
    var index = parseInt(this.dataset.index);
    toggleNeighbours(index);
    countTotalCells();
    score++;
    updateScore(score);
}

var findNeighbours = function findNeighbours(index) {
    var result = {
        t: index < numCols ? null : index - numCols,
        b: index + numCols >= totalCells ? null : index + numCols,
        l: index % numCols === 0 ? null : index - 1,
        r: index % numCols === numCols - 1 ? null : index + 1
    };
    return _extends({}, (!!result.t || result.t === 0) && { t: result.t }, (!!result.b || result.b === 0) && { b: result.b }, (!!result.l || result.l === 0) && { l: result.l }, (!!result.r || result.r === 0) && { r: result.r });
};

var toggleNeighbours = function toggleNeighbours(index) {
    var neighbours = findNeighbours(index);
    for (var prop in neighbours) {
        updateCheckStatus(neighbours, prop);
    }
};

var countTotalCells = function countTotalCells() {
    totalCellsOn = cells.filter(function (cell) {
        return cell.element.checked;
    }).length;
    totalCellsOn === totalCells && endGame();
};

var updateScore = function updateScore() {
    var num = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];


    var scoreBoard = document.getElementsByClassName('score')[0];
    if (!!scoreBoard) {
        scoreBoard.innerHTML = num;
    }
};

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
    for (var i = 0; i < totalCells; i++) {
        cells[i].element.removeEventListener('click', cellClick);
    }
    //levelUP
    var upgradeInterval = setTimeout(upgradeLevel, 5000);
}

var upgradeLevel = function upgradeLevel() {
    currentLevel === levels[0] && (currentLevel = levels[1]);
    // resetGame();
    //update the modals
    currentModal = document.getElementById('modal-levelUp');
    currentModal.classList.toggle('isHidden');
    //let people see
    modalShow();
};
function updateCheckStatus(neighbours, prop) {
    var isChecked = cells[neighbours[prop]].element.checked;
    cells[neighbours[prop]].element.checked = !isChecked;
}

var modalHide = function modalHide() {
    currentModal = document.getElementsByClassName('a-swipeDown')[0];
    if (!!currentModal) {
        currentModal.classList.toggle('a-swipeDown');
        currentModal.classList.add('a-swipeUp');
        var modalInterval = setTimeout(function () {
            dialogElement.classList.toggle('a-fadeOut');
            currentModal.classList.toggle('isHidden');
            currentModal.classList.remove('a-swipeUp');
            var overlayInterval = setTimeout(function () {
                dialogElement.classList.toggle('isHidden');
            }, 500);
        }, 1000);
    }
};

var modalShow = function modalShow() {
    dialogElement.classList.toggle('a-fadeOut');
    dialogElement.classList.toggle('isHidden'); dialogElement.classList.toggle('a-fadeIn');
    currentModal.classList.toggle('a-swipeDown');
};