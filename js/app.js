// Installing App
if ("serviceWorker" in navigator) {
	navigator.serviceWorker
		.register("sw.js")
		.then((reg) => {
			console.log(reg);
		})
		.catch((e) => {
			console.log(e);
		});
}

// Modules
import {
	closeNavBar,
	handleUI,
	updateCount,
	updateDisplay,
	openTaskDetails,
	closeTaskDetails,
	hideListOptions,
} from "./UI.js";
import { handleSettings } from "./modules/settings.js";
import { storage } from "./modules/storage.js";
import { elements } from "./modules/elements.js";
import { initialLists, initialSettings } from "./modules/default.js";
import { handleThemes } from "./modules/themes.js";
import { user } from "./modules/userData.js";
import { notify } from "./modules/notify.js";
import { displayAModal } from "./modules/modal.js";
import "./modules/managingComponents.js";
import { displayComponent } from "./modules/managingComponents.js";

// Global Variables
const SMART_LISTS_IDS = [1, 2, 3, 4, 5];
const userToken = storage.get("token");
const CURRENT_LIST_ID = "currentListId";
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let lists = initialLists;
let userData = {};
let weekDays = [];
let gTaskItem = null;
let priority = "no";
let firstDayOfWeek = new Date().getDate() - new Date().getDay();

// Events
window.addEventListener("contextmenu", (e) => {
	e.preventDefault();
});
elements.deleteList.addEventListener("click", () => {
	const settings = storage.get("settings", initialSettings);
	if (settings.confirmBeforeDeletion) {
		displayAModal(
			"Delete List",
			`Are You Sure You Want To Delete "${elements.listTitle.textContent}`,
			(action) => {
				if (action === "execute") {
					deleteCurrentList();
					hideListOptions();
				}
			}
		);
	} else {
		deleteCurrentList();
	}
});
elements.newListInput.addEventListener("keydown", (e) => {
	if (e.key === "Enter") {
		let val = elements.newListInput.value.trim().length;
		if (val === 0) {
			notify("Invalid Value", "Please Enter A Value", "danger", 2).then(
				() => {
					elements.newListInput.focus();
				}
			);
		} else if (val >= 20) {
			notify(
				"Invalid Value",
				"Value Must Be 20 Characters Or Less",
				"danger",
				2
			).then(() => {
				elements.newListInput.focus();
			});
		} else {
			addNewList(elements.newListInput.value.trim());
			updateCount();
			updateDisplay();
			elements.newListInput.value = "";
			elements.newListInput.blur();
		}
	}
});
elements.renameListInput.addEventListener("keydown", (e) => {
	if (e.key === "Enter") {
		if (elements.renameListInput.value.trim().length >= 20) {
			notify(
				"Invalid Value",
				"Value Must Be 20 Characters Or Less",
				"danger",
				2
			).then(() => {
				elements.newListInput.focus();
			});
		} else {
			renameList(e);
		}
	}
});
elements.renameListInput.addEventListener("blur", (e) => {
	if (elements.renameListInput.value.trim().length >= 20) {
		notify(
			"Invalid Value",
			"Value Must Be 20 Characters Or Less",
			"danger",
			2
		).then(() => {
			elements.newListInput.focus();
		});
	} else {
		renameList(e);
	}
});
elements.addTaskInput.addEventListener("input", () => {
	if (elements.addTaskInput.value.trim().length > 0) {
		elements.validateIcon.style.display = "flex";
	} else {
		elements.validateIcon.style.display = "none";
	}
});
elements.addTaskInput.addEventListener("keydown", (e) => {
	if (e.key === "Enter") {
		let val = elements.addTaskInput.value.trim().length;
		if (val === 0) {
			elements.validateIcon.style.display = "none";
			notify("Invalid Value", "Please Enter A Value", "danger", 2).then(
				() => {
					elements.addTaskInput.focus();
				}
			);
		} else if (val >= 30) {
			notify("Invalid Value", "Value Too Big", "danger", 2).then(() => {
				elements.addTaskInput.focus();
			});
		} else {
			addNewTask(elements.addTaskInput.value.trim(), "no");
			elements.addTaskInput.value = "";
			updateDisplay();
			updateCount();
			elements.validateIcon.style.display = "none";
		}
	}
});
elements.validateIcon.addEventListener("click", () => {
	elements.addTaskInput.focus();

	let val = elements.addTaskInput.value.trim().length;
	if (val === 0) {
		elements.validateIcon.style.display = "none";
		notify("Invalid Value", "Please Enter A Value", "danger", 2).then(
			() => {
				elements.addTaskInput.focus();
			}
		);
	} else if (val >= 30) {
		notify("Invalid Value", "Value Too Big", "danger", 2).then(() => {
			elements.addTaskInput.focus();
		});
	} else {
		addNewTask(elements.addTaskInput.value.trim(), "no");
		elements.addTaskInput.value = "";
		updateDisplay();
		updateCount();
		elements.validateIcon.style.display = "none";
	}
});
elements.moveTaskBtn.addEventListener("click", () => {
	elements.moveTaskMenu.classList.add("show");
	elements.transparentOverlay.classList.add("show");
	handleMovingTask();
});
elements.transparentOverlay.addEventListener("click", () => {
	elements.moveTaskMenu.classList.remove("show");
	elements.transparentOverlay.classList.remove("show");
});
elements.signOutBtn.addEventListener("click", signOut);
elements.deleteTaskBtn.addEventListener("click", () => {
	if (storage.get("settings", initialSettings).confirmBeforeDeletion) {
		displayAModal(
			"Delete Task",
			`Are You Sure You Want To Delete "${gTaskItem.childNodes[1].textContent}"`,
			(action) => {
				if (action === "execute") {
					deleteTask(gTaskItem);
				}
			}
		);
	} else {
		deleteTask(gTaskItem);
	}
});
elements.editTaskInput.addEventListener("keydown", (e) => {
	if (e.key === "Enter") {
		if (elements.editTaskInput.value.trim().length === 0) {
			renameTask(gTaskItem, "Untitled Task");
			elements.editTaskInput.blur();
		} else if (elements.editTaskInput.value.trim().length >= 30) {
			notify("Invalid Value", "Value Too Big", "danger", 2).then(() => {
				elements.addTaskInput.focus();
			});
		} else {
			renameTask(gTaskItem, elements.editTaskInput.value.trim());
			elements.editTaskInput.blur();
		}
		renderAllTasks();
	}
});
elements.editTaskInput.addEventListener("blur", () => {
	if (elements.editTaskInput.value.trim().length === 0) {
		notify("Data Updated Successfully", "", "success", 2);
		renameTask(gTaskItem, "Untitled Task");
		elements.editTaskInput.blur();
	} else if (elements.editTaskInput.value.trim().length >= 30) {
		notify("Invalid Value", "Value Too Big", "danger", 2).then(() => {
			elements.addTaskInput.focus();
		});
	} else {
		notify("Data Updated Successfully", "", "success", 2);
		renameTask(gTaskItem, elements.editTaskInput.value.trim());
		elements.editTaskInput.blur();
	}
	renderAllTasks();
});
elements.completeTaskBtn.addEventListener("click", () => {
	elements.taskDetailsItem.classList.toggle("checked");
	const taskItems = document.querySelectorAll(".task-item");
	taskItems.forEach((taskItem) => {
		if (taskItem.id === gTaskItem.id) {
			completeTask(gTaskItem.id, taskItem);
		}
	});
});
elements.noteTextArea.addEventListener("blur", () => {
	notify("Data Updated Successfully", "", "success", 2);
	addNote(gTaskItem);
	renderAllTasks();
});
elements.choosePriority.addEventListener("click", () => {
	elements.priorityContainer.classList.add("show");
	elements.transparentOverlay.classList.add("show");
});
elements.transparentOverlay.addEventListener("click", () => {
	elements.priorityContainer.classList.remove("show");
	elements.transparentOverlay.classList.remove("show");
});
elements.priorityItems.forEach((item) => {
	item.addEventListener("click", async () => {
		priority = item.getAttribute("data");
		elements.choosePriority.style.color = item.getAttribute("color");
		elements.priorityContainer.classList.remove("show");
		elements.transparentOverlay.classList.remove("show");
		const list = findListById(gTaskItem.getAttribute("parent-id"));
		list.tasks.forEach((task) => {
			if (isSame(gTaskItem.id, task.id)) {
				task.priority = priority;
			}
		});
		renderAllTasks();
		userData.lists = lists;
		await user.save(userToken, userData);
	});
});
elements.barChartBtn.addEventListener("click", () => {
	firstDayOfWeek = new Date().getDate() - new Date().getDay();
	updateTasksOverviewUI(updateTasksOverview(findListById(1)), weekDays);
});
elements.prevWeek.addEventListener("click", () => {
	firstDayOfWeek -= 7;
	updateTasksOverviewUI(updateTasksOverview(findListById(1)), weekDays);
	elements.week.textContent = `${weekDays[0].week}-${
		weekDays[weekDays.length - 1].week
	}`;
});
elements.nextWeek.addEventListener("click", () => {
	firstDayOfWeek += 7;
	updateTasksOverviewUI(updateTasksOverview(findListById(1)), weekDays);
	elements.week.textContent = `${weekDays[0].week}-${
		weekDays[weekDays.length - 1].week
	}`;
});

// Functions
function generateUUID() {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
		/[xy]/g,
		function (c) {
			const r = (Math.random() * 16) | 0;
			const v = c === "x" ? r : (r & 0x3) | 0x8;
			return v.toString(16);
		}
	);
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
function checkEmptyness() {
	const isListEmpty =
		elements.highList.children.length === 0 &&
		elements.lowList.children.length === 0 &&
		elements.mediumList.children.length === 0 &&
		elements.noList.children.length === 0 &&
		elements.completedList.children.length === 0;

	isListEmpty
		? (elements.emptyMessage.style.display = "flex")
		: (elements.emptyMessage.style.display = "none");
	displayMessage(Number(storage.get(CURRENT_LIST_ID)));
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
function trackUsageTime() {
	let start = Date.now();
	setTimeout(() => {
		let timeSpent = Number(storage.get("timeSpent", 0));
		let elapsed = Date.now() - start;
		timeSpent += elapsed;
		storage.set("timeSpent", timeSpent);
		start = Date.now();
		trackUsageTime();
	}, 1000);
}
function renderTasksEveryMidNight() {
	const now = new Date();
	const nextMidnight = new Date(now);
	nextMidnight.setDate(now.getDate() + 1);
	nextMidnight.setHours(0, 0, 0, 0);
	const timeUntilMidnight = nextMidnight - now;
	setTimeout(() => {
		renderAllLists();
		renderAllTasks();
		renderTasksEveryMidNight();
	}, timeUntilMidnight);
}
function findListById(id) {
	return lists.find((list) => Number(list.settings.id) === Number(id));
}
function findTaskById(tasks, id) {
	return tasks.find((task) => Number(task.id) === Number(id));
}
function isSame(elementId, id) {
	return Number(elementId) === Number(id);
}
function signOut() {
	localStorage.removeItem("token");
	window.location.reload();
}
function adjustWeekDays() {
	weekDays = [];
	for (let i = 0; i < 7; i++) {
		const day = {
			name: days[i],
			date: new Date(
				new Date().setDate(firstDayOfWeek + i)
			).toLocaleDateString(),
			week:
				new Date(new Date().setDate(firstDayOfWeek + i)).getMonth() +
				1 +
				"/" +
				new Date(new Date().setDate(firstDayOfWeek + i)).getDate(),
			completedTasks: 0,
			totalTasks: 0,
		};
		weekDays.push(day);
	}
}
function updateWeekDaysStats(dailyList) {
	const weekDaysMap = new Map();
	weekDays.forEach((day) => {
		weekDaysMap.set(day.date, day);
	});
	dailyList.tasks.forEach((task) => {
		const taskDate = new Date(task.id).toLocaleDateString();
		const matchingDay = weekDaysMap.get(taskDate);
		if (matchingDay) {
			if (task.completed) {
				matchingDay.completedTasks++;
			}
			matchingDay.totalTasks++;
		}
	});
	weekDays = Object.values(Object.fromEntries(weekDaysMap.entries()));
}
function updateTasksOverview(dailyList) {
	let completedTasks = 0;
	let totalTasks = 0;
	let average = 0;
	adjustWeekDays();
	updateWeekDaysStats(dailyList);
	weekDays.forEach((day) => {
		completedTasks += day.completedTasks;
		totalTasks += day.totalTasks;
	});
	average = Math.round(completedTasks / 7);
	let percentageOfCompleted = "0%";
	if (totalTasks !== 0) {
		percentageOfCompleted =
			Math.round((completedTasks / totalTasks) * 100) + "%";
	}
	firstDayOfWeek -= 7;
	let prevcompletedTasks = 0;
	let prevtotalTasks = 0;
	adjustWeekDays();
	updateWeekDaysStats(dailyList);
	weekDays.forEach((day) => {
		prevcompletedTasks += day.completedTasks;
		prevtotalTasks += day.totalTasks;
	});
	let progress = "N/A";
	if (prevcompletedTasks !== 0) {
		progress =
			Math.round(
				((completedTasks - prevcompletedTasks) / prevcompletedTasks) *
					100
			) + "%";
	}
	firstDayOfWeek += 7;
	adjustWeekDays();
	updateWeekDaysStats(dailyList);
	return {
		percentageOfCompleted,
		undone: totalTasks - completedTasks,
		completed: completedTasks,
		progress,
		average,
	};
}

function updateTasksOverviewUI(stats, weekDays) {
	console.log(stats);
	console.log(weekDays);
	elements.undoneTasks.textContent = stats.undone;
	elements.completedTasks.textContent = stats.completed;
	const bars = document.querySelectorAll(".bar");
	bars.forEach((bar, index) => {
		bar.style.animationName = "";
		let percentage;
		if (weekDays[index].totalTasks !== 0) {
			percentage =
				Math.round(
					(weekDays[index].completedTasks /
						weekDays[index].totalTasks) *
						100
				) + "%";
		} else {
			percentage = "0%";
		}
		setTimeout(() => {
			bar.style.setProperty("--height", percentage);
			if (percentage !== "0%") {
				bar.setAttribute("per", percentage);
				bar.style.setProperty("--padding", "5px");
			}
			bar.style.animationName = "goHigh";
		}, 300);
	});
	elements.growthDecrease.textContent = stats.progress;
	if (stats.progress === "N/A") {
		elements.growthDecreaseMessege.textContent =
			"No Data For The Progress From Last Week";
	} else if (stats.progress[0] === "-") {
		elements.growthDecreaseMessege.textContent = "From Last Week";
	}
	elements.percentageText.textContent = stats.percentageOfCompleted;
	elements.percentageCircle.style.setProperty("--gradient-angle", "0%");
	setTimeout(() => {
		elements.percentageCircle.style.setProperty(
			"--gradient-angle",
			stats.percentageOfCompleted
		);
	}, 300);
}

// Lists
function handleMovingTask() {
	elements.moveTaskMenu.innerHTML = "<h1>Move Task To:</h1>";
	const fragement = document.createDocumentFragment();
	lists.forEach((list) => {
		const isNotReadOnly =
			list.settings.id !== SMART_LISTS_IDS[1] &&
			list.settings.id !== SMART_LISTS_IDS[2];

		if (isNotReadOnly) {
			const li = document.createElement("li");
			li.textContent = list.settings.title;
			li.id = list.settings.id;
			li.classList.add("hoverable");
			fragement.append(li);
			li.addEventListener("click", async () => {
				const list = findListById(gTaskItem.getAttribute("parent-id"));
				const task = findTaskById(list.tasks, gTaskItem.id);
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
	elements.moveTaskMenu.append(fragement);
	applyHover();
}
async function renameList(e) {
	const value = elements.renameListInput.value.trim();
	let changedValue = "";
	if (e.key === "Enter") {
		// Check If Input's Value Is Empty
		elements.renameListInput.blur();
		if (value.length === 0) {
			changedValue = "Untitled List";
		} else {
			changedValue = value;
		}
		// Change The Title Of The List
		elements.listTitle.textContent = changedValue;
		// Change The List Title In The Lists And Save It
		const list = findListById(storage.get(CURRENT_LIST_ID));
		list.settings.title = changedValue;
		// Change The Title Of The List Item In The Nav Bar
		const listItems = document.querySelectorAll(".list-item");
		listItems.forEach((listItem) => {
			if (isSame(listItem.id, storage.get(CURRENT_LIST_ID))) {
				listItem.lastChild.textContent = changedValue;
			}
		});
		userData.lists = lists;
		await user.save(userToken, userData);
	}
}
async function deleteCurrentList() {
	// Create A List Without The Current List And Saving It
	lists = lists.filter((list) => {
		return !isSame(list.settings.id, storage.get(CURRENT_LIST_ID));
	});
	// Going To The Previous List and Removing The List Item From The DOM
	const listItems = document.querySelectorAll(".list-item");
	listItems.forEach((listItem, index) => {
		if (isSame(listItem.getAttribute("id"), storage.get(CURRENT_LIST_ID))) {
			onListClick(listItems[index - 1]);
			listItem.remove();
		}
	});
	userData.lists = lists;
	await user.save(userToken, userData);
}
function onListClick(listItem) {
	// Change Id Of Page
	storage.set(CURRENT_LIST_ID, Number(listItem.id));
	// Hide Delete And Rename Options For Smart Lists
	if (SMART_LISTS_IDS.includes(Number(storage.get(CURRENT_LIST_ID)))) {
		elements.deleteList.style.display = "none";
		elements.renameList.style.display = "none";
	} else {
		elements.deleteList.style.display = "flex";
		elements.renameList.style.display = "flex";
	}
	// Change Title Of Page
	elements.listTitle.textContent = listItem.textContent;
	// Change Activity For Lists
	const listItems = document.querySelectorAll(".list-item");
	listItems.forEach((list) => {
		list.classList.remove("active");
	});
	listItem.classList.add("active");
	closeNavBar();
	// Display Tasks Of That List
	renderAllTasks();
	checkEmptyness();
	applyHover();
}
async function addNewList(listTitle) {
	// Create List
	const list = {
		settings: {
			id: Date.now(),
			title: listTitle,
			isMain: false,
			theme: null,
			icon: "assets/svgs/list.svg",
		},
		tasks: [],
		completedTasks: [],
		importantTasks: [],
	};

	// Build The List UI
	const fragement = document.createDocumentFragment();
	lists.push(list);
	const listItem = buildList(list, elements.listsContainer, fragement);
	onListClick(listItem); //  Trigger A Click On That List

	listItem.addEventListener("click", () => {
		onListClick(listItem);
	});

	// Saving List In The Storage
	userData.lists = lists;
	await user.save(userToken, userData);
}
function renderAllLists() {
	console.time("Lists");
	// Emptying The Lists Containers
	elements.mainListsContainer.innerHTML = "";
	elements.listsContainer.innerHTML = "";
	const fragement = document.createDocumentFragment();
	lists.forEach((list) => {
		// Building List And Then Appending It In Its Suitable Container
		let listItem;
		if (list.settings.isMain) {
			listItem = buildList(list, elements.mainListsContainer, fragement);
		} else {
			listItem = buildList(list, elements.listsContainer, fragement);
		}

		// Hiding The Delete And Rename Options If The List Is Smart
		if (SMART_LISTS_IDS.includes(Number(storage.get(CURRENT_LIST_ID, 1)))) {
			elements.deleteList.style.display = "none";
			elements.renameList.style.display = "none";
		} else {
			elements.deleteList.style.display = "flex";
			elements.renameList.style.display = "flex";
		}

		// Trigger A onListClick On The Current List
		if (isSame(listItem.id, storage.get(CURRENT_LIST_ID, 1))) {
			onListClick(listItem);
		}

		// Click Event For The List
		listItem.addEventListener("click", () => {
			onListClick(listItem);
		});
	});
	applyHover();
	checkEmptyness();
	console.timeEnd("Lists");
}
function buildList(list, container, fragement) {
	// Create
	const listItem = document.createElement("li");
	const iconContainer = document.createElement("div");
	const svg = document.createElement("img");
	const text = document.createElement("div");
	// Add Classes And Some Changes
	listItem.classList.add("list-item");
	if (isSame(list.settings.id, storage.get(CURRENT_LIST_ID))) {
		listItem.classList.add("active");
		elements.listTitle.textContent = list.settings.title;
	}
	iconContainer.classList.add("icon");
	text.classList.add("text");
	listItem.id = list.settings.id;
	svg.src = `${list.settings.icon}`;
	svg.width = "24";
	svg.height = "24";
	text.textContent = list.settings.title;
	// Appending
	iconContainer.append(svg);
	listItem.append(iconContainer, text);

	fragement.append(listItem);
	container.append(fragement);
	return listItem;
}

// Tasks
function renderAllTasks() {
	console.time("Tasks");
	let tasks;
	elements.tasksContainers.forEach((cont) => {
		cont.innerHTML = "";
	});
	const list = findListById(storage.get(CURRENT_LIST_ID));
	if (list.settings.id === 1) {
		elements.barChartBtn.style.display = "block";
	} else {
		elements.barChartBtn.style.display = "none";
	}
	if (list.settings.id === SMART_LISTS_IDS[2]) {
		tasks = calcCompletedTasks();
		elements.tasksInputContainer.style.opacity = "0";
		elements.tasksInputContainer.style.pointerEvents = "none";
		elements.cornerBtn.style.display = "none";
		elements.animationcircle.style.display = "none";
	} else if (list.settings.id === SMART_LISTS_IDS[1]) {
		tasks = calcAllTasks();
		elements.animationcircle.style.display = "flex";
		elements.cornerBtn.style.display = "flex";
		elements.tasksInputContainer.style.opacity = "1";
		elements.tasksInputContainer.style.pointerEvents = "all";
	} else {
		elements.cornerBtn.style.display = "flex";
		elements.animationcircle.style.display = "flex";
		elements.tasksInputContainer.style.opacity = "1";
		elements.tasksInputContainer.style.pointerEvents = "all";
		tasks = list.tasks;
	}
	const fragement = document.createDocumentFragment();
	tasks.forEach((task) => {
		if (list.settings.id === SMART_LISTS_IDS[0]) {
			if (handleTaskDate(task) === "Today") {
				task.show = true;
			} else {
				task.show = false;
			}
		}
		if (task.show) {
			const [taskItem, checkBox, text] = buildTaskUi(task, fragement);
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
	});
	updateCount();
	updateDisplay();
	applyHover();
	checkEmptyness();
	console.timeEnd("Tasks");
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
async function addNewTask(taskTitle, priority) {
	if (taskTitle.length === 0) return;
	let parentListId;
	const task = {
		id: Date.now(),
		title: taskTitle,
		completed: false,
		priority: priority,
		parentList: null,
		parentListTitle: "",
		subTasks: [],
		note: "",
		show: true,
	};
	// Saving Task In The List
	const list = findListById(storage.get(CURRENT_LIST_ID));
	if (isSame(list.settings.id, SMART_LISTS_IDS[1])) {
		parentListId = 5;
		let tasksList = findListById(parentListId);
		task.parentList = parentListId;
		task.parentListTitle = tasksList.settings.title;
		tasksList.tasks.push(task);
	} else {
		task.parentListTitle = list.settings.title;
		parentListId = list.settings.id;
		task.parentList = parentListId;
		list.tasks.push(task);
	}
	// build Task
	const fragement = document.createDocumentFragment();
	const [taskItem, checkBox, text] = buildTaskUi(task, fragement);
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
	checkEmptyness();
	// Save Data
	userData.lists = lists;
	await user.save(userToken, userData);
}
async function completeTask(id, taskItem) {
	const list = findListById(taskItem.getAttribute("parent-id"));
	const task = findTaskById(list.tasks, id);
	task.completed = !task.completed;
	if (list.settings.id === 1) {
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
function buildTaskUi(task, fragement) {
	// Creating Elements
	const li = document.createElement("li");
	const icon = document.createElement("div");
	const img = document.createElement("img");
	const text = document.createElement("div");
	const date = document.createElement("div");

	// Editing Elements
	li.id = task.id;
	li.setAttribute("parent-id", task.parentList);
	date.classList.add("due-date");
	li.classList.add("task-item", "hoverable");
	icon.classList.add("icon");
	if (task.completed) {
		li.classList.add("checked");
	}
	text.classList.add("text");
	date.textContent = handleTaskDate(task);
	img.src = "assets/svgs/check.svg";
	img.width = "15";
	img.height = "15";
	text.innerHTML = task.title;

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
	fragement.prepend(li);
	container.prepend(fragement);
	return [li, icon, text];
}
function handleTaskClick(taskItem) {
	taskItem.getAttribute("parent-id");
	gTaskItem = taskItem;
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
	checkEmptyness();
	handleTaskDate(gTaskItem);
	openTaskDetails();
}
async function deleteTask(taskItem) {
	const list = findListById(taskItem.getAttribute("parent-id"));
	list.tasks = list.tasks.filter(
		(task) => Number(taskItem.id) !== Number(task.id)
	);
	renderAllTasks();
	checkEmptyness();
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
function handleTaskDate(task) {
	const months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];
	let formattedDate = null;
	const today = new Date().getDate();
	const yesterDay = new Date(
		new Date().setDate(new Date().getDate() - 1)
	).getDate();
	const date = new Date(Number(task.id));
	if (date.getDate() === today) {
		formattedDate = "Today";
		elements.taskDate.textContent = `Created ${formattedDate.toLowerCase()}`;
	} else if (date.getDate() === yesterDay) {
		formattedDate = "Yesterday";
		elements.taskDate.textContent = `Created ${formattedDate.toLowerCase()}`;
	} else {
		if (new Date().getFullYear() !== date.getFullYear()) {
			formattedDate = `${
				months[date.getMonth()]
			} ${date.getDate()} ${date.getFullYear()}`;
		} else {
			formattedDate = `${months[date.getMonth()]} ${date.getDate()}`;
		}
		elements.taskDate.textContent = `Created at ${formattedDate}`;
	}
	return formattedDate;
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

// User Functions
async function initialUserData() {
	if (userToken === null) return window.location.assign("/pages/login.html");
	const data = await user.get(userToken);

	if (data.message === "User Not Found") {
		window.location.assign("/pages/login.html");
		return;
	}

	// Assigning User Data To A Global Variable So It can be used Later Outside This Function
	userData = data.userData;

	// If (lists is empty) then add to it the main initial smart lists (ex: completed & all)
	userData.lists.length === 0
		? (userData.lists = lists)
		: (lists = userData.lists);
	// userData.lists[0].tasks = [];
	console.log(await user.save(userToken, userData));
	// Initial Functions After Getting User Data
	renderAllLists();
	handleUI();
	handleSettings();
	handleThemes();
	applyHover();
	checkEmptyness();

	// Show a welcome messege and hide preloader
	setTimeout(() => {
		elements.loader.classList.add("hide");
		if (storage.get("welcomed") === null) {
			notify(
				`Hello ${data.firstName} !!`,
				"Welcome to To Do!",
				"info",
				4
			);
			storage.set("welcomed", true);
		}
	}, 100);
	elements.greeting.textContent = `Hi ${data.firstName} ${data.lastName}`;
	// CLEAR
	// clearData();
}
async function clearData() {
	await user.clear(userToken, userData);
}

// Initial
initialUserData();
displayComponent();
renderTasksEveryMidNight();
trackUsageTime();
