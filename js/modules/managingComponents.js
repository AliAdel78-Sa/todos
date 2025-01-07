import { elements } from "./elements.js";
import { storage } from "./storage.js";
const components = elements.components;
elements.links.forEach((link) => {
	link.addEventListener("click", () => {
		storage.set("currentPage", link.getAttribute("data-id"));
		displayComponent();
	});
});
export function displayComponent() {
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
	components.forEach((component) => {
		component.classList.remove("show");
	});
	components.forEach((component) => {
		if (component.getAttribute("data-id") === storage.get("currentPage")) {
			component.classList.add("show");
		}
	});
}
