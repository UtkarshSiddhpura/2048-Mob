const GRID_SIZE = 4;
const CELL_SIZE = 20;
const GRID_GAP = 2;

export default class Grid {
	#cells;

	constructor(gridElement) {
		gridElement.style.setProperty("--grid-size", GRID_SIZE);
		gridElement.style.setProperty("--cell-size", `${CELL_SIZE}vmin`);
		gridElement.style.setProperty("--grid-gap", `${GRID_GAP}vmin`);

		this.#cells = createCells(gridElement);
	}

	clearTiles() {
		this.#cells.forEach((cell) => {
			if (cell.tile) {
				cell.tile.remove();
				cell.tile = null;
			}
 		});
	}

	get cells() {
		return this.#cells;
	}

	get cellsByColumn() {
		return this.#cells.reduce((cellGrid, cell) => {
			cellGrid[cell.x] = cellGrid[cell.x] || [];
			cellGrid[cell.x][cell.y] = cell;
			return cellGrid;
		}, []);
	}

	get cellsByRow() {
		return this.#cells.reduce((cellGrid, cell) => {
			cellGrid[cell.y] = cellGrid[cell.y] || [];
			cellGrid[cell.y][cell.x] = cell;
			return cellGrid;
		}, []);
	}

	getRandomEmptyCell() {
		const emptyCells = getEmptyCells(this.#cells);
		return emptyCells[Math.floor(Math.random() * emptyCells.length)];
	}
}

function createCells(element) {
	const cells = [];
	for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
		const cell = new Cell(
			element,
			i % GRID_SIZE,
			Math.floor(i / GRID_SIZE)
		);
		cells.push(cell);
	}
	return cells;
}

function getEmptyCells(cells) {
	return cells.filter((cell) => cell.tile === null);
}

class Cell {
	#x;
	#y;
	#cell;
	#mergeTile;
	#tile;

	constructor(gridElement, x, y) {
		const cell = document.createElement("div");
		cell.classList.add("cell");
		gridElement.append(cell);
		this.#tile = null;
		this.#cell = cell;
		this.#x = x;
		this.#y = y;
	}

	get x() {
		return this.#x;
	}

	get y() {
		return this.#y;
	}

	get tile() {
		return this.#tile;
	}

	set tile(tileObj) {
		this.#tile = tileObj;
		// Set the property only not actual x & y if null or undefined
		if (!tileObj) return;
		this.#tile.x = this.#x;
		this.#tile.y = this.#y;
	}

	get mergeTile() {
		return this.#mergeTile;
	}

	set mergeTile(tileObj) {
		this.#mergeTile = tileObj;
		if (!tileObj) return;
		this.#mergeTile.x = this.#x;
		this.#mergeTile.y = this.#y;
	}

	canAccept(tileObj) {
		return (
			!this.tile ||
			(!this.#mergeTile && this.tile.value === tileObj.value)
		);
	}

	mergeTiles() {
		if (!this.mergeTile || !this.tile) return;
		this.tile.value = this.tile.value + this.mergeTile.value;
		this.mergeTile.remove();
		this.mergeTile = null;
  	}
}
