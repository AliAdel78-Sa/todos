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
import { closeNavBar, handleUI, updateCount, updateDisplay } from "./UI.js";
import { handleSettings } from "./modules/settings.js";
import { storage } from "./modules/storage.js";
import { elements } from "./modules/elements.js";
import { initialLists, initialSettings } from "./modules/default.js";
import { handleThemes } from "./modules/themes.js";
import { user } from "./modules/userData.js";
// CONSTANTS
const SMART_LISTS_IDS = [1, 2, 3, 4, 5];
const userToken = storage.get("token");
const CURRENT_LIST_ID = "currentListId";

// Variables
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
			updateCount();
			updateDisplay();
		} else {
			window.alert("Too Small or Large Value");
		}
	}
});
elements.renameListInput.addEventListener("keydown", (e) => {
	renameList(e);
});
elements.addTaskInput.addEventListener("keydown", (e) => {
	if (e.key === "Enter") {
		addNewTask(elements.addTaskInput.value.trim(), "low");
		elements.addTaskInput.value = "";
		updateDisplay();
		updateCount();
	}
});

// Functions

function findListById(id) {
	return lists.find((list) => Number(list.settings.id) === Number(id));
}
function findTaskById(tasks, id) {
	return tasks.find((task) => Number(task.id) === Number(id));
}
function isValid(text) {
	if (text.length > 0 && text.length < 30) {
		return true;
	} else {
		return false;
	}
}

// Lists
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
			if (Number(listItem.id) === Number(storage.get(CURRENT_LIST_ID))) {
				listItem.lastChild.textContent = changedValue;
			}
		});
		userData.lists = lists;
		console.log(await user.save(userToken, userData));
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
			Number(list.settings.id) !== Number(storage.get(CURRENT_LIST_ID))
		);
	});
	// Going To The Previous List and Removing The List Item From The DOM
	const listItems = document.querySelectorAll(".list-item");
	listItems.forEach((listItem, index) => {
		if (
			Number(listItem.getAttribute("id")) ===
			Number(storage.get(CURRENT_LIST_ID))
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
	lists.push(list);
	const listItem = buildList(list, elements.listsContainer);
	handleListClick(listItem); //  Trigger A Click On That List

	listItem.addEventListener("click", () => {
		handleListClick(listItem);
	});

	// Saving List In The Storage
	userData.lists = lists;
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
		if (SMART_LISTS_IDS.includes(Number(storage.get(CURRENT_LIST_ID, 1)))) {
			elements.deleteList.style.display = "none";
			elements.renameList.style.display = "none";
		} else {
			elements.deleteList.style.display = "flex";
			elements.renameList.style.display = "flex";
		}

		// Trigger A handleListClick On The Current List
		if (Number(storage.get(CURRENT_LIST_ID, 1)) === Number(listItem.id)) {
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
	if (Number(storage.get(CURRENT_LIST_ID)) === Number(list.settings.id)) {
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

// Tasks
function renderAllTasks() {
	elements.tasksContainers.forEach((cont) => {
		cont.innerHTML = "";
	});
	const list = findListById(storage.get(CURRENT_LIST_ID));
	list.tasks.forEach((task) => {
		const [taskItem, checkBox, text] = buildTaskUi(task);
		checkBox.addEventListener("click", () => {
			handleCompletion(checkBox);
		});
		text.addEventListener("click", () => {
			handleCompletion(text);
		});
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

	// Saving Task In The List
	const list = findListById(storage.get(CURRENT_LIST_ID));
	if (Number(list.settings.id) === SMART_LISTS_IDS[1]) {
		parentListId = 5;
		let tasksList = findListById(parentListId);
		task.parentListTitle = tasksList.settings.title;
		tasksList.tasks.push(task);
	} else {
		task.parentListTitle = list.settings.title;
		parentListId = list.settings.id;
		list.tasks.push(task);
	}

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
async function handleCompletion(child) {
	const list = findListById(storage.get(CURRENT_LIST_ID));
	const task = findTaskById(list.tasks, child.parentElement.id);
	if (task.id === +child.parentElement.id) {
		task.completed = !task.completed;
		if (task.completed) {
			if (storage.get("settings", initialSettings).playSound) {
				elements.completetionSound.currentTime = 0;
				elements.completetionSound.volume = 0.5;
				elements.completetionSound.play();
			}
			child.parentElement.classList.add("checked");
		}
		child.parentElement.style.opacity = "0";
		setTimeout(() => {
			renderAllTasks();
		}, 300);
		userData.lists = lists;
		console.log(await user.save(userToken, userData));
	}
}
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
	if (task.completed) {
		li.classList.add("checked");
	}
	text.classList.add("text");
	date.innerHTML = "Today";
	img.src = "assets/svgs/check.svg";
	text.textContent = task.title;

	// Appending Elements
	icon.append(img);
	li.append(icon, text, date);
	let container;
	if (task.completed === true) {
		container = elements.completedList;
	} else if (task.priority === "high") {
		container = elements.highList;
	} else if (task.priority === "medium") {
		container = elements.mediumList;
	} else if (task.priority === "low") {
		container = elements.lowList;
	} else if (task.priority === "no") {
		container = elements.noList;
	}
	container.append(li);
	// Remove the animation class after it completes
	return [li, icon, text];
}

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

	// CLEAR
	// await user.clear(userToken, userData);
}
// Initial
initialUserData();

/*
SAVE:

userData.lists = lists
console.log(await user.save(userToken, userData));
*/

// storage.clear();
