/* TOPICS LEARNED 
	- getters & setters, private Properties, reduce Eff, OOP (how objects interacts)
	- Logic building (e.g How to handle merge Tiles, DOM updation)
*/
import Grid from "./Grid.js";
import Tile from "./Tile.js";
import setupTouchEvents from "./touch.js";

const gridElement = document.querySelector("[data-grid]");
const gridObj = new Grid(gridElement);
gridObj.getRandomEmptyCell().tile = new Tile(gridElement);
gridObj.getRandomEmptyCell().tile = new Tile(gridElement);

function setupKeyboardEvents() {
	document.addEventListener("keydown", handleInputs, { once: true });
}

function setupEvents() {
	setupKeyboardEvents();
	setupTouchEvents(handleInputs);
}
setupEvents();

async function handleInputs(e) {
	switch (e.code) {
		case "ArrowUp":
		case "SwipeUp":
			if (!canMoveUp()) {
				setupEvents();
				return;
			}
			await moveUp();
			break;

		case "ArrowDown":
		case "SwipeDown":
			if (!canMoveDown()) {
				setupEvents();
				return;
			}
			await moveDown();
			break;

		case "ArrowLeft":
		case "SwipeLeft":
			if (!canMoveLeft()) {
				setupEvents();
				return;
			}
			await moveLeft();
			break;

		case "ArrowRight":
		case "SwipeRight":
			if (!canMoveRight()) {
				setupEvents();
				return;
			}
			await moveRight();
			break;

		default:
			setupEvents();
			break;
	}
	// Handling merging and removing merged tiles after each directional move
	gridObj.cells.forEach((cell) => cell.mergeTiles());

	const newTile = new Tile(gridElement);
	gridObj.getRandomEmptyCell().tile = newTile;

	if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
		newTile.waitForTransition(true).then(() => {
			alert("You Lose");
			gridObj.clearTiles();
			gridObj.getRandomEmptyCell().tile = new Tile(gridElement);
			gridObj.getRandomEmptyCell().tile = new Tile(gridElement);
		});
	}
	setupEvents();
}

function canMoveUp() {
	return canMove(gridObj.cellsByColumn);
}
function canMoveDown() {
	return canMove(gridObj.cellsByColumn.map((col) => [...col].reverse()));
}
function canMoveLeft() {
	return canMove(gridObj.cellsByRow);
}
function canMoveRight() {
	return canMove(gridObj.cellsByRow.map((row) => [...row].reverse()));
}

function canMove(grid) {
	return grid.some((group) => {
		return group.some((cell, i) => {
			if (i === 0) return false;
			if (!cell.tile) return false;
			const moveToCell = group[i - 1];
			return moveToCell.canAccept(cell.tile);
		});
	});
}

function moveUp() {
	return slideTiles(gridObj.cellsByColumn);
}

function moveDown() {
	return slideTiles(gridObj.cellsByColumn.map((col) => [...col].reverse()));
}

function moveLeft() {
	return slideTiles(gridObj.cellsByRow);
}

function moveRight() {
	return slideTiles(gridObj.cellsByRow.map((row) => [...row].reverse()));
}

function slideTiles(grid) {
	return Promise.all(
		grid.flatMap((group) => {
			const promises = [];
			for (let i = 1; i < group.length; i++) {
				const currentCell = group[i];
				if (!currentCell.tile) continue;

				let lastValidCell = null;
				for (let j = i - 1; j >= 0; j--) {
					const moveToCell = group[j];
					if (!moveToCell.canAccept(currentCell.tile)) break;
					lastValidCell = moveToCell;
				}
				if (lastValidCell) {
					promises.push(currentCell.tile.waitForTransition());
					if (lastValidCell.tile) {
						lastValidCell.mergeTile = currentCell.tile;
					} else {
						lastValidCell.tile = currentCell.tile;
					}
					currentCell.tile = null;
				}
			}
			return promises;
		})
	);
}
