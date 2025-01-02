/**
 * Handling data in the local storage
 * ====================================
 * 1. set => save an item in the storage
 * 2. get => gets a saved item in the storage
 * 3. clear => clear all the data inside the storage
 * 4. size => get the remained / used size of the stoarge
 */
export const storage = {
	set: (itemName, itemToSet) => {
		window.localStorage.setItem(itemName, JSON.stringify(itemToSet));
	},
	get: (itemToGet, alternateItem = null) => {
		return (
			JSON.parse(window.localStorage.getItem(itemToGet)) || alternateItem
		);
	},
	clear: () => {
		window.localStorage.clear();
	},
	remove: (itemToRemove) => {
		window.localStorage.removeItem(itemToRemove);
	},
	size: () => {
		return {
			Used:
				Math.round(new Blob(Object.values(localStorage)).size / 1024) +
				" KB",
			Remained:
				5000 -
				Math.round(new Blob(Object.values(localStorage)).size / 1024) +
				" KB",
			Percentage:
				Math.round(
					Math.round(
						new Blob(Object.values(localStorage)).size / 1024
					) / 5000
				) + "%",
		};
	},
};
