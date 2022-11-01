export default class Tile {
	#x;
	#y;
	#value;
	#tileElement;

	constructor(gridElement, value = Math.random() > 0.5 ? 2 : 4) {
		const tile = document.createElement("div");
		tile.classList.add("tile");
		gridElement.append(tile);

		this.#tileElement = tile;
		this.value = value;
	}

	get value() {
		return this.#value;
	}

	set value(value) {
		this.#value = value;
		this.#tileElement.innerText = value;

		const power = Math.log2(value);
		const bgColor = `hsl(200, 50%, ${90 - power * 6}%`;
		const color = power < 7 ? "#282828" : "#fff";
		this.#tileElement.style.setProperty("--background-color", bgColor);
		this.#tileElement.style.setProperty("--color", color);
	}

	get x() {
		return this.#x;
	}

	set x(value) {
		this.#tileElement.style.setProperty("--x", value);
		this.#x = value;
	}

	set y(value) {
		this.#tileElement.style.setProperty("--y", value);
		this.#y = value;
	}

	remove() {
		this.#tileElement.remove();
	}

	waitForTransition(animation = false) {
		return new Promise((resolve) => {
			this.#tileElement.addEventListener(
				animation ? "animationend" : "transitionend",
				resolve,
				{
					once: true,
				}
			);
		});
	}
}
