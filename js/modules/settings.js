import { elements } from "./elements.js";
import { initialSettings } from "./default.js";
import { storage } from "./storage.js";

const settingsObject = storage.get("settings", initialSettings);
export function handleSettings() {
	elements.togglers.forEach((toggler) => {
		toggler.addEventListener("input", (e) => {
			const t = e.target;
			const tAttr = t.getAttribute("data-settings");
			if (t.checked === true) {
				settingsObject[tAttr] = true;
				elements.onOff.forEach((elm) => {
					if (elm.getAttribute("data-settings") === tAttr) {
						elm.innerHTML = "On";
					}
				});
				updateDisplay();
				elements.switchBtn.forEach((switchBtn) => {
					if (switchBtn.getAttribute("data-settings") === tAttr) {
						switchBtn.classList.add("checked");
					}
				});
			} else {
				settingsObject[tAttr] = false;
				elements.onOff.forEach((elm) => {
					if (elm.getAttribute("data-settings") === tAttr) {
						elm.innerHTML = "Off";
					}
				});
				elements.switchBtn.forEach((switchBtn) => {
					if (switchBtn.getAttribute("data-settings") === tAttr) {
						switchBtn.classList.remove("checked");
					}
				});
				updateDisplay();
			}
			storage.set("settings", settingsObject);
		});
	});
	for (const key in settingsObject) {
		elements.togglers.forEach((toggler) => {
			if (toggler.getAttribute("data-settings") == key) {
				toggler.checked = settingsObject[key];
			}
		});
		elements.onOff.forEach((e) => {
			if (e.getAttribute("data-settings") == key) {
				if (settingsObject[key] === true) {
					e.innerHTML = "On";
				} else {
					e.innerHTML = "Off";
				}
			}
		});
		elements.switchBtn.forEach((switchBtn) => {
			if (switchBtn.getAttribute("data-settings") === key) {
				if (settingsObject[key] === true) {
					switchBtn.classList.add("checked");
				} else {
					switchBtn.classList.remove("checked");
				}
			}
		});
	}
	updateDisplay();
}
function updateDisplay() {
	const listItems = document.querySelectorAll(".list-item");
	document.body.setAttribute("mode", settingsObject.light ? "light" : "dark");
	listItems.forEach((listItem) => {
		if (listItem.textContent === "Completed") {
			listItem.style.display = settingsObject.showCompleted
				? "flex"
				: "none";
		} else if (listItem.textContent === "Important") {
			listItem.style.display = settingsObject.showImportant
				? "flex"
				: "none";
		} else if (listItem.textContent === "All") {
			listItem.style.display = settingsObject.showAll ? "flex" : "none";
		} else if (listItem.textContent === "Planned") {
			listItem.style.display = settingsObject.showPlanned
				? "flex"
				: "none";
		}
	});
}
