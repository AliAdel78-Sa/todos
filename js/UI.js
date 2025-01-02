import { elements } from "./modules/elements.js";
import { storage } from "./modules/storage.js";
const SMART_LISTS_IDS = [1, 2, 3, 4, 5, 6];

function closeSearchBar() {
	elements.searchBar.classList.remove("show");
	elements.closeSearchBar.classList.remove("show");
	elements.searchOverlay.classList.remove("show");
	clearSearchBar();
	elements.searchBar.blur();
}
function openSearchBar() {
	elements.searchBar.classList.add("show");
	elements.closeSearchBar.classList.add("show");
	elements.searchBar.focus();
	elements.searchOverlay.classList.add("show");
}
function clearSearchBar() {
	elements.searchBar.value = "";
	elements.searchBar.focus();
}
function openNavBar() {
	elements.navBar.classList.add("show");
	elements.navOverlay.classList.add("show");
}
function showTaskInputOptions() {
	elements.taskInput.focus();
	elements.taskInput.value = "";
	elements.taskInputOptions.classList.add("show");
	validate();
}
function hideTaskInputOptions() {
	elements.taskInput.value = "Add a task";
	elements.taskInputOptions.classList.remove("show");
}
function showSettingsAside() {
	elements.settingsBar.classList.add("show");
	elements.asideOverlay.classList.add("show");
}
function hideSettingsAside() {
	elements.settingsBar.classList.remove("show");
	elements.asideOverlay.classList.remove("show");
}
function validate() {
	if (elements.taskInput.value.length > 0) {
		elements.addTaskBtn.classList.add("active");
		return true;
	} else {
		elements.addTaskBtn.classList.remove("active");
		return false;
	}
}
function openListOptions() {
	elements.listOptions.classList.add("show");
	elements.listOptionsOverlay.classList.add("show");
}
function hideListOptions() {
	elements.listOptionsOverlay.classList.remove("show");
	elements.listOptions.classList.remove("show");
}
function hideModal() {
	elements.deleteListModal.classList.remove("show");
	elements.listDeleteOverlay.classList.remove("show");
}
function showThemeMenu() {
	elements.themeMenuOverlay.classList.add("show");
	elements.themeMenu.classList.add("show");
}
function hideThemeMenu() {
	elements.themeMenuOverlay.classList.remove("show");
	elements.themeMenu.classList.remove("show");
}
function showRenameInput() {
	elements.listTitle.style.display = "none";
	elements.renameListInput.style.display = "block";
	elements.renameListInput.focus();
	elements.renameListInput.select();
	elements.renameListInput.value = elements.listTitle.textContent;
}
function hideRenameInput() {
	elements.listTitle.style.display = "block";
	elements.renameListInput.style.display = "none";
}
export function closeNavBar() {
	elements.navBar.classList.remove("show");
	elements.navOverlay.classList.remove("show");
}

export function handleUI() {
	elements.renameList.addEventListener("click", () => {
		hideListOptions();
		showRenameInput();
	});
	elements.renameListInput.addEventListener("blur", hideRenameInput);
	elements.listTitle.addEventListener("click", () => {
		if (SMART_LISTS_IDS.includes(Number(storage.get("currentListId", 1)))) {
			return;
		} else {
			showRenameInput();
		}
	});
	elements.newListInput.addEventListener("focus", () => {
		elements.newListInput.value = "";
	});
	elements.newListInput.addEventListener("keydown", (e) => {
		if (e.key === "Enter") {
			elements.newListInput.value = "New List";
			elements.newListInput.blur();
		}
	});
	elements.themes.forEach((theme) => {
		theme.addEventListener("click", () => {
			hideThemeMenu();
			hideListOptions();
		});
	});
	elements.listDeleteOverlay.addEventListener("click", hideModal);
	elements.cancelDeleteBtn.addEventListener("click", hideModal);
	elements.deleteList.addEventListener("click", hideListOptions);
	elements.deleteListBtn.addEventListener("click", () => {
		hideListOptions();
		hideModal();
	});
	elements.changeThemeBtn.addEventListener("click", showThemeMenu);
	elements.themeMenuOverlay.addEventListener("click", hideThemeMenu);
	elements.closeNavBtn.addEventListener("click", closeNavBar);
	elements.openNavBtn.addEventListener("click", openNavBar);
	elements.navOverlay.addEventListener("click", closeNavBar);
	elements.newListInput.addEventListener("blur", () => {
		elements.newListInput.value = "New List";
	});
	elements.cornerBtn.addEventListener("click", showTaskInputOptions);
	elements.searchBar.addEventListener("input", () => {
		if (elements.searchBar.value.length > 0) {
			elements.closeSearchBar.style.display = "flex";
		} else {
			elements.closeSearchBar.style.display = "none";
		}
	});
	elements.searchBar.addEventListener("focus", () => {
		elements.closeSearchBar.style.display = "none";
	});
	elements.taskInput.addEventListener("focus", showTaskInputOptions);
	elements.taskInput.addEventListener("blur", hideTaskInputOptions);
	elements.taskInput.addEventListener("input", validate);
	elements.searchBarIcon.addEventListener("click", openSearchBar);
	elements.closeSearchBar.addEventListener("click", clearSearchBar);
	elements.searchOverlay.addEventListener("click", closeSearchBar);
	elements.settingsBtn.addEventListener("click", showSettingsAside);
	elements.asideOverlay.addEventListener("click", hideSettingsAside);
	elements.closeSettingsBar.addEventListener("click", hideSettingsAside);
	elements.listOptionsMenu.addEventListener("click", openListOptions);
	elements.listOptionsOverlay.addEventListener("click", hideListOptions);
}
