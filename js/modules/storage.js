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
		try {
			window.localStorage.setItem(itemName, JSON.stringify(itemToSet));
		} catch (e) {
			storage.clear();
			window.alert("Storage Is Full");
			console.log(e);
		}
	},
	get: (itemToGet, alternateItem = null) => {
		try {
			return (
				JSON.parse(window.localStorage.getItem(itemToGet)) ||
				alternateItem
			);
		} catch (e) {
			console.log(e);
		}
	},
	clear: () => {
		try {
			window.localStorage.clear();
		} catch (e) {
			console.log(e);
		}
	},
	remove: (itemToRemove) => {
		try {
			window.localStorage.removeItem(itemToRemove);
		} catch (e) {
			console.log(e);
		}
	},
	size: () => {
		try {
			const sizeObject = {
				Used:
					Math.round(
						new Blob(Object.values(localStorage)).size / 1024
					) + " KB",
				Remained:
					5000 -
					Math.round(
						new Blob(Object.values(localStorage)).size / 1024
					) +
					" KB",
				Percentage:
					Math.round(
						Math.round(
							new Blob(Object.values(localStorage)).size / 1024
						) / 5000
					) + "%",
			};
			return sizeObject;
		} catch (e) {
			console.log(e);
		}
	},
};
