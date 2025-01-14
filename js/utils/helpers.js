import { lists } from "../app.js";
import { elements } from "../modules/elements.js";
import { storage } from "../modules/storage.js";
const SMART_LISTS_IDS = ["1", "2", "3", "4"];
const CURRENT_LIST_ID = "currentListId";
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Utilities
function generateId() {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0;
		const v = c === "x" ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}
function applyHover() {
	const hoverableElements = document.querySelectorAll(".hoverable");

	hoverableElements.forEach((element) => {
		element.addEventListener("touchstart", (e) => {
			if (e.target === element) {
				element.classList.add("hover-effect");
			}
		});

		element.addEventListener("touchend", () => {
			element.classList.remove("hover-effect");
		});
	});
}
function toggleEmptyMessage() {
	const isListEmpty =
		elements.highList.children.length === 0 &&
		elements.lowList.children.length === 0 &&
		elements.mediumList.children.length === 0 &&
		elements.noList.children.length === 0 &&
		elements.completedList.children.length === 0;
	isListEmpty
		? (elements.emptyMessage.style.display = "flex")
		: (elements.emptyMessage.style.display = "none");
	displayMessage(storage.get(CURRENT_LIST_ID));
}
function displayMessage(id) {
	const messages = {
		1: {
			title: "Daily Tasks",
			description: `In Daily Tasks List, Tasks Disappears After Every Midnight`,
		},
		2: {
			title: "All List",
			description: "A List That Contains All Tasks Of All Lists",
		},
		3: {
			title: "Completed List",
			description: "You Can See All Your Completed Tasks here",
		},
		4: {
			title: "Planned List",
			description: "You Can Add here Tasks You Plan To Do In The Future",
		},
		5: {
			title: "Tasks List",
			description: "A List That Contains All Unorganized Tasks",
		},
	};
	if (messages[id]) {
		elements.emptyTitle.textContent = messages[id].title;
		elements.emptyDescription.textContent = messages[id].description;
	} else {
		elements.emptyTitle.textContent = "Empty List";
		elements.emptyDescription.textContent =
			"Your list is currently empty. Consider adding some tasks.";
	}
}
function findListById(id) {
	return lists.find((list) => list.settings.id === id);
}
function findTaskById(tasks, id) {
	return tasks.find((task) => task.id === id);
}
function isSame(elementId, id) {
	return elementId === id;
}
function formatDate(timeStamp) {
	timeStamp = Number(timeStamp);
	if (isNaN(timeStamp)) {
		console.warn("Invalid Date");
		return "Invalid Date";
	}
	const months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"June",
		"July",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];
	const date = new Date(timeStamp);
	const today = new Date();
	const yesterday = new Date();
	yesterday.setDate(today.getDate() - 1);
	const isToday =
		date.getFullYear() === today.getFullYear() &&
		date.getMonth() === today.getMonth() &&
		date.getDate() === today.getDate();
	const isYesterday =
		date.getFullYear() === yesterday.getFullYear() &&
		date.getMonth() === yesterday.getMonth() &&
		date.getDate() === yesterday.getDate();

	const isTheSameYear = date.getFullYear() === today.getFullYear();
	if (isToday) return "Today";
	if (isYesterday) return "Yesterday";
	const formattedDate = `${months[date.getMonth()]} ${date.getDate()}`;

	return isTheSameYear
		? formattedDate
		: `${formattedDate} ${date.getFullYear()}`;
}

export {
	findTaskById,
	applyHover,
	toggleEmptyMessage,
	findListById,
	isSame,
	formatDate,
	generateId,
	CURRENT_LIST_ID,
	SMART_LISTS_IDS,
	days,
};
