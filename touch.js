export default function setupTouchEvents(swipeHandler) {
	document.addEventListener("touchstart", handleTouchStart, { once: true });
	document.addEventListener(
		"touchend",
		(e) => {
			handleTouchMove(e, swipeHandler);
		},
		{ once: true }
	);
}

const swipeEvent = {};
let xDown = null;
let yDown = null;

function handleTouchStart(evt) {
	const initialTouch = evt.touches[0];
	xDown = initialTouch.clientX;
	yDown = initialTouch.clientY;
}

function handleTouchMove(evt, swipeHandler) {
	if (!xDown || !yDown) {
		return;
	}
	let xUp = evt.changedTouches[evt.changedTouches.length-1].pageX;;
	let yUp = evt.changedTouches[evt.changedTouches.length-1].pageY;;

	let xDiff = xDown - xUp;
	let yDiff = yDown - yUp;

	if (Math.abs(xDiff) > Math.abs(yDiff)) {
		if (xDiff > 0) {
			swipeHandler(dispatchEvent("SwipeLeft"));
		} else {
			swipeHandler(dispatchEvent("SwipeRight"));
		}
	} else {
		if (yDiff > 0) {
			swipeHandler(dispatchEvent("SwipeUp"));
		} else {
			swipeHandler(dispatchEvent("SwipeDown"));
		}
	}
	xDown = null;
	yDown = null;
}

function dispatchEvent(event) {
	return {
		code: event,
	};
}
