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
	handleUI,
	syncCounts,
	toggleTasksVisibility,
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
import { displayComponent } from "./modules/managingComponents.js";
import {
	renderAllTasks,
	renderTasksEveryMidNight,
} from "./utils/renderTasks.js";
import {
	addNewTask,
	addNote,
	completeTask,
	deleteTask,
	handleMovingTask,
	renameTask,
} from "./utils/tasksActions.js";
import { clickedTaskItem } from "./utils/tasksActions.js";
import { renderAllLists } from "./utils/renderLists.js";
import {
	addNewList,
	deleteCurrentList,
	renameList,
} from "./utils/listsActions.js";
import {
	applyHover,
	findListById,
	isSame,
	toggleEmptyMessage,
} from "./utils/helpers.js";
import {
	updateTasksOverview,
	updateTasksOverviewUI,
} from "./utils/tasksOverview.js";

let userData = {};
let weekDays = [];
let lists = initialLists;
let firstDayOfWeek = new Date().getDate() - new Date().getDay();
const userToken = storage.get("token");

// Events
function initializeEvents() {
	listsEvents();
	tasksEvents();
	otherEvents();
	statsEvents();
}
function listsEvents() {
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
				notify(
					"Invalid Value",
					"Please Enter A Value",
					"danger",
					2
				).then(() => {
					elements.newListInput.focus();
				});
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
				syncCounts();
				toggleTasksVisibility();
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
}
function tasksEvents() {
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
				notify(
					"Invalid Value",
					"Please Enter A Value",
					"danger",
					2
				).then(() => {
					elements.addTaskInput.focus();
				});
			} else if (val >= 30) {
				notify("Invalid Value", "Value Too Big", "danger", 2).then(
					() => {
						elements.addTaskInput.focus();
					}
				);
			} else {
				addNewTask(elements.addTaskInput.value.trim(), "no");
				elements.addTaskInput.value = "";
				toggleTasksVisibility();
				syncCounts();
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
			toggleTasksVisibility();
			syncCounts();
			elements.validateIcon.style.display = "none";
		}
	});
	elements.moveTaskBtn.addEventListener("click", () => {
		elements.moveTaskMenu.classList.add("show");
		elements.transparentOverlay.classList.add("show");
		handleMovingTask();
	});
	elements.deleteTaskBtn.addEventListener("click", () => {
		if (storage.get("settings", initialSettings).confirmBeforeDeletion) {
			displayAModal(
				"Delete Task",
				`Are You Sure You Want To Delete "${clickedTaskItem.childNodes[1].textContent}"`,
				(action) => {
					if (action === "execute") {
						deleteTask(clickedTaskItem);
					}
				}
			);
		} else {
			deleteTask(clickedTaskItem);
		}
	});
	elements.editTaskInput.addEventListener("keydown", (e) => {
		if (e.key === "Enter") {
			if (elements.editTaskInput.value.trim().length === 0) {
				renameTask(clickedTaskItem, "Untitled Task");
				elements.editTaskInput.blur();
			} else if (elements.editTaskInput.value.trim().length >= 30) {
				notify("Invalid Value", "Value Too Big", "danger", 2).then(
					() => {
						elements.addTaskInput.focus();
					}
				);
			} else {
				renameTask(
					clickedTaskItem,
					elements.editTaskInput.value.trim()
				);
				elements.editTaskInput.blur();
			}
			renderAllTasks();
		}
	});
	elements.editTaskInput.addEventListener("blur", () => {
		if (elements.editTaskInput.value.trim().length === 0) {
			notify("Data Updated Successfully", "", "success", 2);
			renameTask(clickedTaskItem, "Untitled Task");
			elements.editTaskInput.blur();
		} else if (elements.editTaskInput.value.trim().length >= 30) {
			notify("Invalid Value", "Value Too Big", "danger", 2).then(() => {
				elements.addTaskInput.focus();
			});
		} else {
			notify("Data Updated Successfully", "", "success", 2);
			renameTask(clickedTaskItem, elements.editTaskInput.value.trim());
			elements.editTaskInput.blur();
		}
		renderAllTasks();
	});
	elements.completeTaskBtn.addEventListener("click", () => {
		elements.taskDetailsItem.classList.toggle("checked");
		const taskItems = document.querySelectorAll(".task-item");
		taskItems.forEach((taskItem) => {
			if (taskItem.id === clickedTaskItem.id) {
				completeTask(clickedTaskItem.id, taskItem);
			}
		});
	});
	elements.noteTextArea.addEventListener("blur", () => {
		notify("Data Updated Successfully", "", "success", 2);
		addNote(clickedTaskItem);
		renderAllTasks();
	});
	elements.choosePriority.addEventListener("click", () => {
		elements.priorityContainer.classList.add("show");
		elements.transparentOverlay.classList.add("show");
	});
	elements.priorityItems.forEach((item) => {
		item.addEventListener("click", async () => {
			elements.choosePriority.style.color = item.getAttribute("color");
			elements.priorityContainer.classList.remove("show");
			elements.transparentOverlay.classList.remove("show");
			const list = findListById(
				clickedTaskItem.getAttribute("parent-id")
			);
			list.tasks.forEach((task) => {
				if (isSame(clickedTaskItem.id, task.id)) {
					task.priority = item.getAttribute("data");
				}
			});
			renderAllTasks();
			userData.lists = lists;
			await user.save(userToken, userData);
		});
	});
}
function otherEvents() {
	window.addEventListener("contextmenu", (e) => {
		e.preventDefault();
	});
	elements.transparentOverlay.addEventListener("click", () => {
		elements.moveTaskMenu.classList.remove("show");
		elements.transparentOverlay.classList.remove("show");
	});
	elements.signOutBtn.addEventListener("click", signOut);
	elements.transparentOverlay.addEventListener("click", () => {
		elements.priorityContainer.classList.remove("show");
		elements.transparentOverlay.classList.remove("show");
	});
}
function statsEvents() {
	elements.barChartBtn.addEventListener("click", () => {
		firstDayOfWeek = new Date().getDate() - new Date().getDay();
		updateTasksOverviewUI(updateTasksOverview(findListById("1")), weekDays);
		elements.week.textContent = `${weekDays[0].week}-${
			weekDays[weekDays.length - 1].week
		}`;
	});
	elements.prevWeek.addEventListener("click", () => {
		firstDayOfWeek -= 7;
		updateTasksOverviewUI(updateTasksOverview(findListById("1")), weekDays);
		elements.week.textContent = `${weekDays[0].week}-${
			weekDays[weekDays.length - 1].week
		}`;
	});
	elements.nextWeek.addEventListener("click", () => {
		firstDayOfWeek += 7;
		updateTasksOverviewUI(updateTasksOverview(findListById("1")), weekDays);
		elements.week.textContent = `${weekDays[0].week}-${
			weekDays[weekDays.length - 1].week
		}`;
	});
}

// Utilities
function signOut() {
	storage.remove("token");
	window.location.reload();
}
function setLists(newData) {
	lists = newData;
}
function setFirstDayOfWeek(newData) {
	firstDayOfWeek = newData;
}
function setWeekDays(newData) {
	weekDays = newData;
}

// User Functions
async function initialUserData() {
	if (userToken === null) return window.location.assign("/pages/login.html");
	const data = await user.get(userToken);
	initializeLists(data);
	renderAllLists();
	handleUI();
	handleSettings();
	handleThemes();
	applyHover();
	toggleEmptyMessage();
	welcomeUser(data);
	// CLEAR
	// clearData();
}
async function clearData() {
	storage.clear();
	await user.clear(userToken, userData);
}
async function initializeLists(data) {
	if (data.message === "User Not Found") {
		window.location.assign("/pages/login.html");
		return;
	}
	userData = data.userData;
	userData.lists.length === 0
		? (userData.lists = lists)
		: (lists = userData.lists);
	console.log(await user.save(userToken, userData));
}
function welcomeUser(data) {
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
}
// Initial
initialUserData();
displayComponent();
renderTasksEveryMidNight();
initializeEvents();
export {
	userToken,
	setLists,
	setFirstDayOfWeek,
	userData,
	lists,
	weekDays,
	firstDayOfWeek,
	setWeekDays,
};
