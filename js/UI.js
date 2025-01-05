import { elements } from "./modules/elements.js";
import { storage } from "./modules/storage.js";
const SMART_LISTS_IDS = [1, 2, 3, 4, 5, 6];
let initialHeight = window.visualViewport.height;

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
function initialLink() {
	elements.links.forEach((link) => {
		if (
			storage.get("currentPage", "to-do-list") ===
			link.getAttribute("data-id")
		) {
			link.classList.add("active");
		}
	});
}
function openNavBar() {
	elements.navBar.classList.add("show");
	elements.navOverlay.classList.add("show");
}
function showSettingsAside() {
	elements.settingsBar.classList.add("show");
	elements.asideOverlay.classList.add("show");
}
function hideSettingsAside() {
	elements.settingsBar.classList.remove("show");
	elements.asideOverlay.classList.remove("show");
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
export function updateDisplay() {
	elements.tasksContainers.forEach((cont) => {
		if (cont.childElementCount === 0) {
			cont.parentElement.style.display = "none";
			cont.parentElement.previousElementSibling.style.display = "none";
		} else {
			cont.parentElement.previousElementSibling.style.display = "flex";
			cont.parentElement.style.display = "grid";
		}
	});
}
function countTasks() {
	let counts = [];
	elements.tasksContainers.forEach((cont) => {
		counts.push(cont.childElementCount);
	});
	return counts;
}
export function updateCount() {
	countTasks().forEach((n, i) => {
		elements.headers[i].childNodes[3].innerHTML = n;
	});
}
export function handleUI() {
	elements.headers.forEach((header) => {
		header.addEventListener("click", () => {
			header.classList.toggle("show");
			header.nextElementSibling.classList.toggle("show");
			header.childNodes[5].classList.toggle("rotate");
		});
	});
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
	elements.newListInput.addEventListener("keydown", (e) => {
		if (e.key === "Enter") {
			elements.newListInput.value = "";
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
		elements.newListInput.value = "";
	});
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
	elements.searchBarIcon.addEventListener("click", openSearchBar);
	elements.closeSearchBar.addEventListener("click", clearSearchBar);
	elements.searchOverlay.addEventListener("click", closeSearchBar);
	elements.settingsBtn.addEventListener("click", showSettingsAside);
	elements.asideOverlay.addEventListener("click", hideSettingsAside);
	elements.closeSettingsBar.addEventListener("click", hideSettingsAside);
	elements.listOptionsMenu.addEventListener("click", openListOptions);
	elements.listOptionsOverlay.addEventListener("click", hideListOptions);
	elements.cornerBtn.addEventListener("click", () => {
		elements.addTaskInput.focus();
	});
	window.visualViewport.addEventListener("resize", () => {
		const currentHeight = window.visualViewport.height;
		if (currentHeight < initialHeight) {
			elements.addTaskInput.style.bottom = `${
				window.innerHeight - window.innerHeight / 2
			}px`;
			elements.addTaskInput.style.opacity = "1";
			elements.addTaskInput.style.pointerEvents = "all";
		} else {
			elements.addTaskInput.style.bottom = "0";
			elements.addTaskInput.style.opacity = "0";
			elements.addTaskInput.style.pointerEvents = "none";
		}
	});

	elements.links.forEach((link) => {
		link.addEventListener("click", () => {
			elements.links.forEach((link) => {
				link.classList.remove("active");
			});
			link.classList.add("active");
			link.style.animationName = "scaleDown";
			setTimeout(() => {
				link.style.animationName = "";
			}, 200);
			storage.set("currentPage", link.getAttribute("data-id"));
		});
	});
	initialLink();
}
