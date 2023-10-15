function Puzzle(canvasContext, boxSize) {
  this.puzzleMatrix = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 0],
  ];

  this.boxColor = "#08e8de";

  this.canvasContext = canvasContext;
  this.boxSize = boxSize;

  this.puzzleMoves = 0;
}

Puzzle.prototype.getpuzzleMoves = function () {
  return this.puzzleMoves;
};

Puzzle.prototype.swapCells = function (x, y) {
  const nullCell = this.getEmptyCellCoordinates();
  const xDiff = Math.abs(x - nullCell.x);
  const yDiff = Math.abs(y - nullCell.y);

  if ((xDiff === 1 && yDiff === 0) || (xDiff === 0 && yDiff === 1)) {
    [this.puzzleMatrix[nullCell.y][nullCell.x], this.puzzleMatrix[y][x]] = [
      this.puzzleMatrix[y][x],
      this.puzzleMatrix[nullCell.y][nullCell.x],
    ];
    this.puzzleMoves++;
  }
};
Puzzle.prototype.isPuzzleSolved = function() {
  let combination = [[1,2,3,4], [5,6,7,8], [9,10,11,12], [13,14,15,0]];
  let res = true;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (combination[i][j] != this.puzzleMatrix[i][j]) {
        res = false;
        break;
      }
    }
  }
  return res;
};

Puzzle.prototype.cellView = function (x, y) {
  const { canvasContext, boxColor, boxSize } = this;
  canvasContext.fillStyle = boxColor;
  canvasContext.fillRect(x + 1, y + 1, boxSize - 2, boxSize - 2);
};

Puzzle.prototype.drawNumber = function () {
  this.canvasContext.font = "bold " + this.boxSize / 2 + "px Courier";
  this.canvasContext.textAlign = "center";
  this.canvasContext.textBaseline = "middle";
  this.canvasContext.fillStyle = "#FFD700";
};

Puzzle.prototype.drawPuzzle = function () {
  this.canvasContext.fillStyle = "#000000";
  this.canvasContext.fillRect(
    0,
    0,
    this.canvasContext.canvas.width,
    this.canvasContext.canvas.height
  );
  this.puzzleMatrix.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell > 0) {
        this.cellView(j * this.boxSize, i * this.boxSize);
        this.drawNumber();
        this.canvasContext.fillText(
          cell,
          j * this.boxSize + this.boxSize / 2,
          i * this.boxSize + this.boxSize / 2
        );
      }
    });
  });
};

Puzzle.prototype.getEmptyCellCoordinates = function () {
  let y = this.puzzleMatrix.findIndex((row) => row.indexOf(0) !== -1);
  let x = this.puzzleMatrix[y].indexOf(0);
  return { x: x, y: y };
};

Puzzle.prototype.shufflePuzzle = function (count) {
  let nullCell, row, col;

  for (let i = 0; i < count; i++) {
    nullCell = this.getEmptyCellCoordinates();
    row = nullCell.x;
    col = nullCell.y;

    const dir = Math.floor(Math.random() * 4); 
    if (dir === 0 && row > 0) {
      this.swapCells(row - 1, col);
    } else if (dir === 1 && col < 3) {
      this.swapCells(row, col + 1);
    } else if (dir === 2 && row < 3) {
      this.swapCells(row + 1, col);
    } else if (dir === 3 && col > 0) {
      this.swapCells(row, col - 1);
    }
  }

  this.puzzleMoves = 0;
};
document.addEventListener("DOMContentLoaded", function () {
  let canvas = document.getElementById("canvas");
  canvas.width = 320;
  canvas.height = 320;
  let canvasContext = canvas.getContext("2d");
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);
  let boxSize = canvas.width / 4;
  let puzzle = new Puzzle(canvasContext, boxSize);
  puzzle.shufflePuzzle(300);
  puzzle.drawPuzzle();

  canvas.addEventListener("click", function (e) {
    let x = ((e.pageX - canvas.offsetLeft) / boxSize) | 0;
    let y = ((e.pageY - canvas.offsetTop) / boxSize) | 0;
    onEvent(x, y);
  });
  canvas.addEventListener("touchend", function (e) {
    let x = ((e.touches[0].pageX - canvas.offsetLeft) / boxSize) | 0;
    let y = ((e.touches[0].pageY - canvas.offsetTop) / boxSize) | 0;
    onEvent(x, y);
  });

  let shuffleButton = document.getElementById("shuffleButton");
  shuffleButton.addEventListener("click", function () {
    puzzle.shufflePuzzle(300);
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    puzzle.drawPuzzle();
  });
  function onEvent(x, y) {
    puzzle.swapCells(x, y);
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    puzzle.drawPuzzle();
    if (puzzle.isPuzzleSolved()) {
      alert("Ukończono w " + puzzle.getpuzzleMoves() + " ruchów!");
      puzzle.shufflePuzzle(300);
      canvasContext.fillRect(0, 0, canvas.width, canvas.height);
      puzzle.drawPuzzle(context, boxSize);
    }
  }
});
