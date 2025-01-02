import { storage } from "./storage.js";
import { initialSettings } from "./default.js";
import { elements } from "./elements.js";

export function handleThemes() {
	const settings = storage.get("settings", initialSettings);
	document.body.setAttribute("theme", settings.theme);
	elements.themes.forEach((theme) => {
		document.body.getAttribute("theme") ===
		theme.getAttribute("data-settings")
			? theme.classList.add("selected")
			: theme.classList.remove("selected");
		theme.addEventListener("click", () => {
			elements.themes.forEach((theme) => {
				theme.classList.remove("selected");
			});
			theme.classList.add("selected");
			document.body.setAttribute(
				"theme",
				theme.getAttribute("data-settings")
			);
			settings.theme = theme.getAttribute("data-settings");
			storage.set("settings", settings);
		});
	});
}
