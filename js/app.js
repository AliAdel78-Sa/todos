// Modules
import { handleUI } from "./UI.js";
import { renderTasksEveryMidNight } from "./utils/renderTasks.js";
import { tasksEvents } from "./utils/tasksActions.js";
import { listsEvents } from "./utils/listsActions.js";
import {
	applyHover,
	lists,
	setLists,
	setUserData,
	toggleEmptyMessage,
	userData,
	userToken,
} from "./utils/helpers.js";
import { handleSettings } from "./modules/settings.js";
import { storage } from "./modules/storage.js";
import { elements } from "./modules/elements.js";
import { handleThemes } from "./modules/themes.js";
import { user } from "./modules/userData.js";
import { notify } from "./modules/notify.js";
import { displayComponent } from "./modules/managingComponents.js";
import { renderAllLists } from "./utils/renderLists.js";
import { statsEvents } from "./utils/tasksOverview.js";

//  Functions
function initializeEvents() {
	listsEvents();
	tasksEvents();
	otherEvents();
	statsEvents();
}
function otherEvents() {
	window.addEventListener("contextmenu", (e) => {
		e.preventDefault();
	});
	elements.signOutBtn.addEventListener("click", () => {
		storage.remove("token");
		window.location.reload();
	});
	elements.transparentOverlay.addEventListener("click", () => {
		elements.moveTaskMenu.classList.remove("show");
		elements.transparentOverlay.classList.remove("show");
		elements.priorityContainer.classList.remove("show");
		elements.transparentOverlay.classList.remove("show");
	});
}
async function initialUserData() {
	if (userToken === null) return window.location.assign("/pages/login.html");
	const data = await user.get(userToken);
	initializeLists(data);
	// clearData();
	renderAllLists();
	handleUI();
	handleSettings();
	handleThemes();
	applyHover();
	toggleEmptyMessage();
	welcomeUser(data);
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
	setUserData(data.userData);
	userData.lists.length === 0
		? (userData.lists = lists)
		: setLists(userData.lists);

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
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js");
