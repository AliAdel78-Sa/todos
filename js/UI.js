import { elements } from "./modules/elements.js";
import { storage } from "./modules/storage.js";
const SMART_LISTS_IDS = [1, 2, 3, 4, 5, 6];

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
	elements.mainOverlay.classList.add("show");
}
function showSettingsAside() {
	elements.settingsBar.classList.add("show");
	elements.mainOverlay.classList.add("show");
}
function hideSettingsAside() {
	elements.settingsBar.classList.remove("show");
	elements.mainOverlay.classList.remove("show");
}
function openListOptions() {
	elements.listOptions.classList.add("show");
	elements.mainOverlay.classList.add("show");
}
export function hideListOptions() {
	elements.mainOverlay.classList.remove("show");
	elements.listOptions.classList.remove("show");
}
function showThemeMenu() {
	elements.secondryOverlay.classList.add("show");
	elements.themeMenu.classList.add("show");
}
function hideThemeMenu() {
	elements.secondryOverlay.classList.remove("show");
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
	elements.mainOverlay.classList.remove("show");
	elements.newListInput.value = "";
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
export function closeTaskDetails() {
	elements.taskDetails.classList.remove("show");
	elements.mainOverlay.classList.remove("show");
}
export function openTaskDetails() {
	elements.mainOverlay.classList.add("show");
	elements.taskDetails.classList.add("show");
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
	elements.themes.forEach((theme) => {
		theme.addEventListener("click", () => {
			hideThemeMenu();
			hideListOptions();
		});
	});
	elements.changeThemeBtn.addEventListener("click", showThemeMenu);
	elements.secondryOverlay.addEventListener("click", hideThemeMenu);
	elements.closeNavBtn.addEventListener("click", closeNavBar);
	elements.openNavBtn.addEventListener("click", openNavBar);
	elements.mainOverlay.addEventListener("click", closeNavBar);
	elements.settingsBtn.addEventListener("click", showSettingsAside);
	elements.mainOverlay.addEventListener("click", hideSettingsAside);
	elements.closeSettingsBar.addEventListener("click", hideSettingsAside);
	elements.listOptionsMenu.addEventListener("click", openListOptions);
	elements.mainOverlay.addEventListener("click", hideListOptions);
	elements.cornerBtn.addEventListener("click", () => {
		elements.addTaskInput.focus();
	});
	elements.mainOverlay.addEventListener("click", closeTaskDetails);
	elements.closeTaskDetails.addEventListener("click", closeTaskDetails);
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
