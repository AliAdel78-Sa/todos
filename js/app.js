// Modules
import {
	closeNavBar,
	handleUI,
	updateCount,
	updateDisplay,
	validate,
} from "./UI.js";
import { handleSettings } from "./modules/settings.js";
import { storage } from "./modules/storage.js";
import { elements } from "./modules/elements.js";
import { initialLists, initialSettings } from "./modules/default.js";
import { handleThemes } from "./modules/themes.js";
import { user } from "./modules/userData.js";
// Variables
const SMART_LISTS_IDS = [1, 2, 3, 4, 5];
const userToken = storage.get("token");
let lists = initialLists;
let userData = {};
// Events
elements.deleteListBtn.addEventListener("click", deleteCurrentList);
elements.deleteList.addEventListener("click", () => {
	const settings = storage.get("settings", initialSettings);
	if (settings.confirmBeforeDeletion) {
		showModal();
	} else {
		deleteCurrentList();
	}
});
elements.newListInput.addEventListener("keydown", (e) => {
	if (e.key === "Enter") {
		if (isValid(elements.newListInput.value.trim())) {
			addNewList(elements.newListInput.value.trim());
		} else {
			window.alert("Too Small or Large Value");
		}
	}
});
elements.renameListInput.addEventListener("keydown", (e) => {
	renameList(e);
});
// Functions
async function renameList(e) {
	const value = elements.renameListInput.value.trim();
	let changedValue = "";

	if (e.key === "Enter") {
		elements.renameListInput.blur();
		if (value.length < 0) {
			changedValue = "Untitled";
		} else {
			changedValue = value;
		}

		// Change The Title Of The List
		elements.listTitle.textContent = changedValue;

		// Change The List Title In The Lists And Save It
		lists.forEach((list) => {
			if (
				Number(list.settings.id) ===
				Number(storage.get("currentListId", 1))
			) {
				list.settings.title = changedValue;
			}
		});

		// Change The Title Of The List Item In The Nav Bar
		const listItems = document.querySelectorAll(".list-item");
		listItems.forEach((listItem) => {
			if (Number(listItem.id) === Number(storage.get("currentListId"))) {
				listItem.lastChild.textContent = changedValue;
			}
		});

		userData.lists = lists;
		console.log(await user.save(userToken, userData));
	}
}
function isValid(text) {
	if (text.length > 0 && text.length < 30) {
		return true;
	} else {
		return false;
	}
}
function showModal() {
	elements.deleteListModal.classList.add("show");
	elements.listDeleteOverlay.classList.add("show");
	elements.deleteListTitle.textContent = `Are You Sure You Want To Delete "${elements.listTitle.textContent}"`;
}
async function deleteCurrentList() {
	// Create A List Without The Current List And Saving It
	lists = lists.filter((list) => {
		return (
			Number(list.settings.id) !== Number(storage.get("currentListId"))
		);
	});
	// Going To The Previous List and Removing The List Item From The DOM
	const listItems = document.querySelectorAll(".list-item");
	listItems.forEach((listItem, index) => {
		if (
			Number(listItem.getAttribute("id")) ===
			Number(storage.get("currentListId"))
		) {
			handleListClick(listItems[index - 1]);
			listItem.remove();
		}
	});
	userData.lists = lists;
	console.log(await user.save(userToken, userData));
}
function handleListClick(listItem) {
	// Change Id Of Page
	storage.set("currentListId", Number(listItem.id));
	// Hide Delete And Rename Options For Smart Lists
	if (SMART_LISTS_IDS.includes(Number(storage.get("currentListId")))) {
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
	const listItem = buildList(list, elements.listsContainer);
	handleListClick(listItem); //  Trigger A Click On That List

	listItem.addEventListener("click", () => {
		handleListClick(listItem);
	});
	// Saving List In The Storage
	userData.lists.push(list);
	console.log(await user.save(userToken, userData));
}
function renderAllLists() {
	// Emptying The Lists Containers
	elements.mainListsContainer.innerHTML = "";
	elements.listsContainer.innerHTML = "";

	lists.forEach((list) => {
		// Building List And Then Appending It In Its Suitable Container
		let listItem;
		if (list.settings.isMain) {
			listItem = buildList(list, elements.mainListsContainer);
		} else {
			listItem = buildList(list, elements.listsContainer);
		}

		// Hiding The Delete And Rename Options If The List Is Smart
		if (SMART_LISTS_IDS.includes(Number(storage.get("currentListId", 1)))) {
			elements.deleteList.style.display = "none";
			elements.renameList.style.display = "none";
		} else {
			elements.deleteList.style.display = "flex";
			elements.renameList.style.display = "flex";
		}

		// Trigger A handleListClick On The Current List
		if (Number(storage.get("currentListId", 1)) === Number(listItem.id)) {
			handleListClick(listItem);
		}

		// Click Event For The List
		listItem.addEventListener("click", () => {
			handleListClick(listItem);
		});
	});
}
function buildList(list, container) {
	// Create
	const listItem = document.createElement("li");
	const iconContainer = document.createElement("div");
	const svg = document.createElement("img");
	const text = document.createElement("div");
	// Add Classes And Some Changes
	listItem.classList.add("list-item");
	if (Number(storage.get("currentListId")) === Number(list.settings.id)) {
		listItem.classList.add("active");
		elements.listTitle.textContent = list.settings.title;
	}
	iconContainer.classList.add("icon");
	text.classList.add("text");
	listItem.id = list.settings.id;
	svg.src = `${list.settings.icon}`;
	text.textContent = list.settings.title;
	// Appending
	iconContainer.append(svg);
	listItem.append(iconContainer, text);
	container.append(listItem);

	return listItem;
}
function renderAllTasks() {
	elements.tasksContainers.forEach((cont) => {
		cont.innerHTML = "";
	});
	lists.forEach((list) => {
		if (+list.settings.id === +storage.get("currentListId")) {
			list.tasks.forEach((task) => {
				const [taskItem, checkBox, text] = buildTaskUi(task);
				checkBox.addEventListener("click", () => {
					handleCompletion(checkBox);
				});
				text.addEventListener("click", () => {
					handleCompletion(text);
				});
			});
		}
	});
	updateCount();
	updateDisplay();
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
	};
	lists.forEach((list) => {
		if (Number(list.settings.id) === Number(storage.get("currentListId"))) {
			if (Number(list.settings.id) === SMART_LISTS_IDS[1]) {
				parentListId = 5;
				lists.forEach((list) => {
					if (+list.settings.id === parentListId) {
						list.tasks.push(task);
						task.parentListTitle = list.settings.title;
					}
				});
			} else {
				parentListId = list.settings.id;
				task.parentListTitle = list.settings.title;
				list.tasks.push(task);
			}
		}
	});
	task.parentList = parentListId;
	// build Task
	const [taskItem, checkBox, text] = buildTaskUi(task);
	checkBox.addEventListener("click", () => {
		handleCompletion(checkBox);
	});
	text.addEventListener("click", () => {
		handleCompletion(text);
	});
	// Save Data
	userData.lists = lists;
	console.log(await user.save(userToken, userData));
}
function handleCompletion(checkBox) {
	lists.forEach((list) => {
		if (list.settings.id === +storage.get("currentListId")) {
			list.tasks.forEach(async (task) => {
				if (task.id === +checkBox.parentElement.id) {
					if (task.completed === true) {
						task.completed = false;
					} else {
						task.completed = true;
					}
					renderAllTasks();
					userData.lists = lists;
					console.log(await user.save(userToken, userData));
				}
			});
		}
	});
}
function handleTaskClick() {
	showTaskModal();
}
function showTaskModal(task) {}
function buildTaskUi(task) {
	// Creating Elements
	const li = document.createElement("li");
	const icon = document.createElement("div");
	const img = document.createElement("img");
	const text = document.createElement("div");
	const date = document.createElement("div");

	// Editing Elements
	li.id = task.id;
	date.classList.add("due-date");
	li.classList.add("task-item");
	icon.classList.add("icon");
	text.classList.add("text");
	date.innerHTML = "Today";
	img.src = "assets/svgs/check.svg";
	text.textContent = task.title;

	// Appending Elements

	icon.append(img);
	li.append(icon, text, date);

	if (task.completed === true) {
		elements.completedList.append(li);
	} else if (task.priority === "high") {
		elements.highList.append(li);
	} else if (task.priority === "medium") {
		elements.mediumList.append(li);
	} else if (task.priority === "low") {
		elements.lowList.append(li);
	} else if (task.priority === "no") {
		elements.noList.append(li);
	}

	return [li, icon, text];
}
elements.addTaskInput.addEventListener("keydown", (e) => {
	if (e.key === "Enter") {
		addNewTask(elements.addTaskInput.value.trim(), "no");
		console.log(lists);
		elements.addTaskInput.value = "";
		validate();
	}
});
// For User
async function initialUserData() {
	if (userToken === null) return window.location.assign("/pages/login.html");
	const data = await user.get(userToken);
	userData = data.userData;
	userData.lists.length === 0
		? (userData.lists = lists)
		: (lists = userData.lists);
	console.log(await user.save(userToken, userData));
	elements.profilePhoto.innerHTML = data.firstName[0] + data.lastName[0];
	renderAllLists();
	handleUI();
	handleSettings();
	handleThemes();
	renderAllTasks();
	setTimeout(() => elements.loader.classList.add("hide"), 100);
}
// Initial
initialUserData();

/*
CLEAR:
user.clear(userToken, userData);


SAVE:

userData.lists = lists
console.log(await user.save(userToken, userData));
*/

// storage.clear();
