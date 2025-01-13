import { lists } from "../app.js";
import { buildTaskUi, completeTask, handleTaskClick } from "./tasksActions.js";
import {
	applyHover,
	SMART_LISTS_IDS,
	findListById,
	CURRENT_LIST_ID,
	toggleEmptyMessage,
	formatDate,
} from "./helpers.js";
import { elements } from "../modules/elements.js";
import { storage } from "../modules/storage.js";
import { syncCounts, toggleTasksVisibility } from "../UI.js";

function hideTaskInput() {
	elements.tasksInputContainer.style.opacity = "0";
	elements.tasksInputContainer.style.pointerEvents = "none";
	elements.cornerBtn.style.display = "none";
	elements.animationcircle.style.display = "none";
}
function showTaskInput() {
	elements.tasksInputContainer.style.opacity = "1";
	elements.tasksInputContainer.style.pointerEvents = "all";
	elements.animationcircle.style.display = "flex";
	elements.cornerBtn.style.display = "flex";
}
function renderAllTasks() {
	elements.tasksContainers.forEach((cont) => {
		cont.innerHTML = "";
	});
	showTaskInput();
	const list = findListById(storage.get(CURRENT_LIST_ID));
	const tasks = prepareTaskList(list, list.tasks);
	const fragment = document.createDocumentFragment();
	tasks.forEach((task) => {
		const disallowVisibility =
			list.settings.id === SMART_LISTS_IDS[0] &&
			formatDate(task.date) !== "Today";
		if (disallowVisibility) {
			task.show = false;
		}
		if (task.show) {
			const [taskItem, checkBox, text] = buildTaskUi(task, fragment);
			addTaskEventListeners(taskItem, checkBox, text);
		}
	});
	syncCounts();
	toggleTasksVisibility();
	applyHover();
	toggleEmptyMessage();
}
function prepareTaskList(list, tasks) {
	list.settings.id === "1"
		? (elements.barChartBtn.style.display = "block")
		: (elements.barChartBtn.style.display = "none");
	if (list.settings.id === SMART_LISTS_IDS[2]) {
		tasks = calcCompletedTasks();
		hideTaskInput();
	}
	if (list.settings.id === SMART_LISTS_IDS[1]) tasks = calcAllTasks();
	return tasks;
}
function addTaskEventListeners(taskItem, checkBox, text) {
	checkBox.addEventListener("click", () => {
		completeTask(taskItem.id, taskItem);
	});
	text.addEventListener("click", () => {
		completeTask(taskItem.id, taskItem);
	});
	taskItem.addEventListener("click", (e) => {
		if (e.target === taskItem) {
			handleTaskClick(taskItem);
		}
	});
}
function calcCompletedTasks() {
	let tasks = [];
	lists.forEach((list) => {
		list.tasks.forEach((task) => {
			if (task.completed) {
				tasks.push(task);
			}
		});
	});
	return tasks;
}
function calcAllTasks() {
	let tasks = [];
	lists.forEach((list) => {
		list.tasks.forEach((task) => {
			if (task.show) {
				tasks.push(task);
			}
		});
	});
	return tasks;
}
function renderTasksEveryMidNight() {
	const now = new Date();
	const nextMidnight = new Date(now);
	nextMidnight.setDate(now.getDate() + 1);
	nextMidnight.setHours(0, 0, 0, 0);
	const timeUntilMidnight = nextMidnight - now;
	setTimeout(() => {
		renderAllTasks();
		renderTasksEveryMidNight();
	}, timeUntilMidnight);
}

export { renderTasksEveryMidNight, renderAllTasks };
