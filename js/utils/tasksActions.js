import { lists, userData, userToken } from "../app.js";
import { initialSettings } from "../modules/default.js";
import { elements } from "../modules/elements.js";
import { storage } from "../modules/storage.js";
import { user } from "../modules/userData.js";
import { closeTaskDetails, openTaskDetails } from "../UI.js";
import {
	findListById,
	isSame,
	formatDate,
	toggleEmptyMessage,
	findTaskById,
	CURRENT_LIST_ID,
	generateId,
	SMART_LISTS_IDS,
	applyHover,
} from "./helpers.js";
import { renderAllTasks } from "./renderTasks.js";
let clickedTaskItem = null;
// Task
async function addNewTask(taskTitle, priority) {
	if (taskTitle.length === 0) return;
	const list = findListById(storage.get(CURRENT_LIST_ID));
	const task = {
		id: generateId(),
		date: Date.now(),
		title: taskTitle,
		completed: false,
		priority: priority,
		parentList: list.settings.id,
		parentListTitle: list.settings.title,
		subTasks: [],
		note: "",
		show: true,
	};
	if (isSame(list.settings.id, SMART_LISTS_IDS[1])) {
		let tasksList = findListById("4");
		task.parentList = "4";
		task.parentListTitle = tasksList.settings.title;
		tasksList.tasks.push(task);
	} else list.tasks.push(task);

	renderAllTasks();
	// Save Data
	userData.lists = lists;
	await user.save(userToken, userData);
}
async function completeTask(id, taskItem) {
	const list = findListById(taskItem.getAttribute("parent-id"));
	const task = findTaskById(list.tasks, id);
	task.completed = !task.completed;
	if (list.settings.id === "1") {
		if (task.completed) {
			list.completedTasks++;
		} else {
			list.completedTasks--;
		}
	}
	if (task.completed) {
		if (storage.get("settings", initialSettings).playSound) {
			const audio = new Audio("../assets/sounds/complete-sound.mp3");
			audio.currentTime = 0;
			audio.volume = 0.5;
			audio.play();
		}
		taskItem.classList.add("checked");
	}
	taskItem.style.opacity = "0";
	setTimeout(() => {
		renderAllTasks();
	}, 300);
	userData.lists = lists;
	await user.save(userToken, userData);
}
function buildTaskUi(task, fragment) {
	// Creating Elements
	const li = document.createElement("li");
	const icon = document.createElement("div");
	const img = document.createElement("img");
	const text = document.createElement("div");
	const date = document.createElement("div");

	// Editing Elements
	li.id = task.id;
	li.date = task.date;
	li.setAttribute("parent-id", task.parentList);
	date.classList.add("due-date");
	li.classList.add("task-item", "hoverable");
	icon.classList.add("icon");
	if (task.completed) {
		li.classList.add("checked");
	}
	text.classList.add("text");
	date.textContent = formatDate(task.date);

	img.src = "assets/svgs/check.svg";
	img.width = "15";
	img.height = "15";
	text.innerHTML = task.title;
	if (clickedTaskItem) {
		elements.taskDate.textContent = `Created at ${formatDate(
			clickedTaskItem.date
		)}`;
	}
	// Appending Elements
	icon.append(img);
	li.append(icon, text, date);
	const priorityContainers = {
		high: elements.highList,
		medium: elements.mediumList,
		low: elements.lowList,
		no: elements.noList,
	};
	const container = task.completed
		? elements.completedList
		: priorityContainers[task.priority];
	fragment.prepend(li);
	container.prepend(fragment);
	return [li, icon, text];
}
function handleTaskClick(taskItem) {
	taskItem.getAttribute("parent-id");
	clickedTaskItem = taskItem;
	elements.editTaskInput.value = taskItem.childNodes[1].textContent;
	const list = findListById(taskItem.getAttribute("parent-id"));
	list.tasks.forEach((task) => {
		if (isSame(taskItem.id, task.id)) {
			elements.noteTextArea.value = task.note;
			if (task.priority === "high") {
				elements.choosePriority.style.color = "red";
			}
			if (task.priority === "medium") {
				elements.choosePriority.style.color = "orange";
			}
			if (task.priority === "low") {
				elements.choosePriority.style.color = "blue";
			}
			if (task.priority === "no") {
				elements.choosePriority.style.color = "gray";
			}
		}
	});
	if (taskItem.classList.contains("checked")) {
		elements.taskDetailsItem.classList.add("checked");
	} else {
		elements.taskDetailsItem.classList.remove("checked");
	}
	elements.taskDate.textContent = `Created at ${formatDate(
		clickedTaskItem.date
	)}`;
	toggleEmptyMessage();
	openTaskDetails();
}
async function deleteTask(taskItem) {
	const list = findListById(taskItem.getAttribute("parent-id"));
	list.tasks = list.tasks.filter((task) => taskItem.id !== task.id);
	renderAllTasks();
	toggleEmptyMessage();
	closeTaskDetails();
	userData.lists = lists;
	await user.save(userToken, userData);
}
async function renameTask(taskItem, newTitle) {
	const list = findListById(taskItem.getAttribute("parent-id"));
	list.tasks.forEach((task) => {
		if (isSame(taskItem.id, task.id)) {
			task.title = newTitle;
			elements.editTaskInput.value = newTitle;
		}
	});
	userData.lists = lists;
	await user.save(userToken, userData);
}
async function addSubTask(task, subTaskTitle) {
	const subTask = {
		title: subTaskTitle,
		id: generateId(),
		completed: false,
		parentTask: task.id,
	};
	task?.subtasks.push(subTask);
	userData.lists = lists;
	await user.save(userToken, userData);
}
async function addNote(taskItem) {
	const list = findListById(taskItem.getAttribute("parent-id"));
	list.tasks.forEach((task) => {
		if (isSame(taskItem.id, task.id)) {
			task.note = elements.noteTextArea.value;
		}
	});
	// Save
	userData.lists = lists;
	await user.save(userToken, userData);
}
function handleMovingTask() {
	elements.moveTaskMenu.innerHTML = "<h1>Move Task To:</h1>";
	const fragment = document.createDocumentFragment();
	lists.forEach((list) => {
		const isNotReadOnly =
			list.settings.id !== SMART_LISTS_IDS[1] &&
			list.settings.id !== SMART_LISTS_IDS[2];

		if (isNotReadOnly) {
			const li = document.createElement("li");
			li.textContent = list.settings.title;
			li.id = list.settings.id;
			li.classList.add("hoverable");
			fragment.append(li);
			li.addEventListener("click", async () => {
				const list = findListById(
					clickedTaskItem.getAttribute("parent-id")
				);
				const task = findTaskById(list.tasks, clickedTaskItem.id);
				list.tasks = list.tasks.filter(
					(taskItem) => taskItem.id !== task.id
				);
				const selectedList = findListById(li.id);
				task.parentList = selectedList.settings.id;
				task.parentListTitle = selectedList.settings.title;
				selectedList.tasks.push(task);
				elements.moveTaskMenu.classList.remove("show");
				elements.transparentOverlay.classList.remove("show");
				elements.taskDetails.classList.remove("show");
				elements.mainOverlay.classList.remove("show");
				renderAllTasks();
				userData.lists = lists;
				await user.save(userToken, userData);
			});
		}
	});
	elements.moveTaskMenu.append(fragment);
	applyHover();
}

export {
	addNewTask,
	addNote,
	addSubTask,
	renameTask,
	deleteTask,
	handleTaskClick,
	completeTask,
	buildTaskUi,
	handleMovingTask,
	clickedTaskItem,
};
