import { elements } from "./elements.js";
export function displayAModal(title, body, callBack) {
	elements.secondryOverlay.classList.add("show");
	const modal = `<div class="modal show">
			<h2>${title}</h2>
			<p>
				${body}
			</p>
			<div class="btns">
				<button class="delete-btn execute-btn">Delete</button>
				<button class="cancel-btn">Cancel</button>
			</div>
		</div>`;
	document.querySelector(".modals").innerHTML += modal;
	const modalElement = document.querySelector(".modal");
	const executeBtn = document.querySelector(".execute-btn");
	const cancelBtn = document.querySelector(".cancel-btn");
	executeBtn.addEventListener("click", () => {
		elements.secondryOverlay.classList.remove("show");
		modalElement.style.animationName = "fade-out";
		callBack("execute");
		setTimeout(() => {
			modalElement.remove();
		}, 200);
	});
	cancelBtn.addEventListener("click", () => {
		elements.secondryOverlay.classList.remove("show");
		modalElement.style.animationName = "fade-out";
		callBack("cancel");
		setTimeout(() => {
			modalElement.remove();
		}, 200);
	});
	elements.secondryOverlay.addEventListener("click", () => {
		elements.secondryOverlay.classList.remove("show");
		modalElement.style.animationName = "fade-out";
		callBack("cancel");
		setTimeout(() => {
			modalElement.remove();
		}, 200);
	});
}
