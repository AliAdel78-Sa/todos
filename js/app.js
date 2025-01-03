// Modules
import { closeNavBar, handleUI } from "./UI.js";
import { handleSettings } from "./modules/settings.js";
import { storage } from "./modules/storage.js";
import { elements } from "./modules/elements.js";
import { initialLists, initialSettings } from "./modules/default.js";
import { handleThemes } from "./modules/themes.js";
import { user } from "./modules/userData.js";

// Variables

const SMART_LISTS_IDS = [1, 2, 3, 4, 5, 6];
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

	// renderAllTasks(listItem);
}
async function addNewList(listTitle) {
	// Create List
	const list = {
		settings: {
			id: Date.now(),
			title: listTitle,
			isMain: false,
			pinned: false,
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
