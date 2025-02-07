import {
	closeNavBar,
	hideListOptions,
	syncCounts,
	toggleTasksVisibility,
} from "../UI.js";
import {
	applyHover,
	CURRENT_LIST_ID,
	findListById,
	generateId,
	isSame,
	lists,
	setLists,
	SMART_LISTS_IDS,
	toggleEmptyMessage,
	userData,
	userToken,
} from "./helpers.js";
import { notify } from "../modules/notify.js";
import { elements } from "../modules/elements.js";
import { storage } from "../modules/storage.js";
import { user } from "../modules/userData.js";
import { renderAllTasks } from "./renderTasks.js";
import { initialSettings } from "../modules/default.js";
import { displayAModal } from "../modules/modal.js";

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
	setLists(
		lists.filter((list) => {
			return !isSame(list.settings.id, storage.get(CURRENT_LIST_ID));
		})
	);
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
	storage.set(CURRENT_LIST_ID, listItem.id);
	// Hide Delete And Rename Options For Smart Lists
	if (SMART_LISTS_IDS.includes(storage.get(CURRENT_LIST_ID))) {
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
	toggleEmptyMessage();
	applyHover();
}
async function addNewList(listTitle) {
	// Create List
	const list = {
		settings: {
			id: generateId(),
			date: Date.now(),
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
	const fragment = document.createDocumentFragment();
	lists.push(list);
	const listItem = buildList(list, elements.listsContainer, fragment);
	onListClick(listItem); //  Trigger A Click On That List

	listItem.addEventListener("click", () => {
		onListClick(listItem);
	});

	// Saving List In The Storage
	userData.lists = lists;
	await user.save(userToken, userData);
}
function buildList(list, container, fragment) {
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

	fragment.append(listItem);
	container.append(fragment);
	return listItem;
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
export { buildList, onListClick, listsEvents };
