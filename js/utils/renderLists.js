import { elements } from "../modules/elements.js";
import { storage } from "../modules/storage.js";
import {
	applyHover,
	CURRENT_LIST_ID,
	isSame,
	lists,
	SMART_LISTS_IDS,
	toggleEmptyMessage,
} from "./helpers.js";
import { buildList, onListClick } from "./listsActions.js";
function renderAllLists() {
	// Emptying The Lists Containers
	elements.mainListsContainer.innerHTML = "";
	elements.listsContainer.innerHTML = "";
	const fragment = document.createDocumentFragment();
	lists.forEach((list) => {
		// Building List And Then Appending It In Its Suitable Container
		let listItem;
		if (list.settings.isMain) {
			listItem = buildList(list, elements.mainListsContainer, fragment);
		} else {
			listItem = buildList(list, elements.listsContainer, fragment);
		}

		// Hiding The Delete And Rename Options If The List Is Smart
		if (SMART_LISTS_IDS.includes(storage.get(CURRENT_LIST_ID, "1"))) {
			elements.deleteList.style.display = "none";
			elements.renameList.style.display = "none";
		} else {
			elements.deleteList.style.display = "flex";
			elements.renameList.style.display = "flex";
		}

		// Trigger A onListClick On The Current List
		if (isSame(listItem.id, storage.get(CURRENT_LIST_ID, "1"))) {
			onListClick(listItem);
		}
		// Adding Event To The List
		listItem.addEventListener("click", () => {
			onListClick(listItem);
		});
	});
	applyHover();
	toggleEmptyMessage();
}
export { renderAllLists };
