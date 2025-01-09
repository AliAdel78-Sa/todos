import { elements } from "./elements.js";

// ===============
// Event Listeners
// ===============
elements.startButton.addEventListener("click", startTimer);
elements.stopButton.addEventListener("click", stopTimer);
elements.resetButton.addEventListener("click", resetTimer);

// ================
// Global Variables
// ================
let intervalId = null;
let running = JSON.parse(localStorage.getItem("running") || false);
let totalPausedTime = Number(localStorage.getItem("totalPausedTime") || 0);

// ==============
// Main Functions
// ==============
function startTimer() {
	if (localStorage.getItem("startedTime") === null) {
		localStorage.setItem("startedTime", Date.now());
	} else if (localStorage.getItem("lastPause") !== null) {
		const lastPause = Number(localStorage.getItem("lastPause"));
		totalPausedTime += Date.now() - lastPause;
		localStorage.setItem("totalPausedTime", totalPausedTime);
		localStorage.removeItem("lastPause");
	}
	if (intervalId === null) {
		intervalId = setInterval(() => {
			const startedTime = Number(localStorage.getItem("startedTime"));
			const rawElapsedTime = Date.now() - startedTime;
			const pureElapsedTime = rawElapsedTime - totalPausedTime;
			elements.timerDisplay.innerHTML = formatTime(pureElapsedTime);
		}, 10);
	}
	localStorage.setItem("running", true);
	updateUI("start");
}
function stopTimer() {
	clearInterval(intervalId);
	intervalId = null;
	localStorage.setItem("lastPause", Date.now());
	localStorage.setItem("running", false);
	localStorage.setItem("currentTimeText", elements.timerDisplay.innerHTML);
	updateUI("stop");
}
function resetTimer() {
	clearInterval(intervalId);
	intervalId = null;
	localStorage.removeItem("running");
	localStorage.removeItem("startedTime");
	localStorage.removeItem("lastPause");
	localStorage.removeItem("currentTimeText");
	localStorage.removeItem("totalPausedTime");
	elements.timerDisplay.innerHTML = `00:00.00`;
	totalPausedTime = 0;
	updateUI("reset");
}

// ==========================================================================
// Helper Functions For Updating UI and Formatting Numbers To A Readable Form
// ==========================================================================

// Format The Milliseconds To A Readable Form (i.e. hh:mm:ss.ms)
function formatTime(ms) {
	const totalSeconds = Math.floor(ms / 1000);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;
	const milliseconds = ms % 1000;
	if (hours === 0) {
		return `${addZero(minutes)}:${addZero(seconds)}.${addZero(
			Math.floor(milliseconds / 10)
		)}`;
	} else {
		return `${addZero(hours)}:${addZero(minutes)}:${addZero(seconds)}`;
	}
}
// Add Zero To The Start Of The Number That Is Less Than 10 (ex: 00:00:00 instead of 0:0:0)
function addZero(n) {
	return String(n).padStart(2, "0");
}
// Update The UI Of The Timer When Pressing The Start Button / Reset Button / Pause Buttton
function updateUI(status) {
	switch (status) {
		case "stop":
			elements.startButton.style.display = "flex";
			elements.startButton.innerHTML = "Resume";
			elements.resetButton.style.display = "flex";
			elements.stopButton.style.display = "none";
			elements.resetButton.classList.remove("bg-disabled");
			break;
		case "start":
			elements.stopButton.style.display = "flex";
			elements.startButton.innerHTML = "Resume";
			elements.resetButton.style.display = "flex";
			elements.startButton.style.display = "none";
			elements.resetButton.classList.remove("bg-disabled");
			break;
		case "reset":
			elements.startButton.style.display = "flex";
			elements.startButton.innerHTML = "Start";
			elements.resetButton.style.display = "flex";
			elements.stopButton.style.display = "none";
			elements.resetButton.classList.add("bg-disabled");
			break;
	}
}

// Running When The User Let It Run
elements.timerDisplay.innerHTML =
	localStorage.getItem("currentTimeText") || `00:00.00`;
if (running === true) {
	startTimer();
}

if (localStorage.getItem("startedTime") !== null) {
	elements.resetButton.classList.remove("bg-disabled");
	elements.startButton.innerHTML = "Resume";
}

elements.stopWatchLink.addEventListener("click", (e) => {
	e.target.classList.add("active");
	elements.timerLink.classList.remove("active");
});

elements.timerLink.addEventListener("click", (e) => {
	e.target.classList.add("active");
	elements.stopWatchLink.classList.remove("active");
});
