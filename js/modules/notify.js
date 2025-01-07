import { elements } from "./elements.js";
/**
 *
 * @param {string} title The Title Of The Notification
 * @param {string} body The Body of the notification
 * @param {string} type danger | success | info
 * @param {number} time The Duration Of The Notification In Seconds
 */
export function notify(title, body, type, time) {
	return new Promise((res, rej) => {
		elements.notifications.innerHTML = "";
		let icon;
		if (type === "danger") {
			icon = "warning";
		} else if (type === "success") {
			icon = "done";
		} else {
			icon = "chat_bubble";
		}
		const n = `<div class="notification ${type}">
			<div>
				<span class="material-symbols-outlined icon" id="notify-icon"
					>${icon}</span
				>
				<div>
					<h3 class="notification-title">${title}</h3>
					<p class="notification-body">
						${body}
					</p>
				</div>
				<span class="material-symbols-outlined close-btn">close</span>
			</div>
		</div>`;
		elements.notifications.innerHTML += n;
		const notifyElement = document.querySelector(".notification");
		const closeBtn = document.querySelector(".close-btn");
		notifyElement.style.animationName = "come";
		setTimeout(() => {
			notifyElement.style.animationName = "fade";
			setTimeout(() => {
				notifyElement.remove();
			}, 500);
		}, time * 1000);
		closeBtn.addEventListener("click", () => {
			res();
			notifyElement.style.animationName = "fade";
			setTimeout(() => {
				notifyElement.remove();
			}, 500);
		});
	});
}
