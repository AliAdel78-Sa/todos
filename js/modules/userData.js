import { storage } from "./storage.js";

export const user = {
	get: async (token) => {
		const data = await getUserData(token);
		return data;
	},
	save: async (token, userData) => {
		const data = await saveUsersData(token, userData);
		return data;
	},

	clear: async (token, userData) => {
		userData.lists = [];
		storage.set("currentListId", 1);
		storage.set("settings", null);
		const data = await saveUsersData(token, userData);
		return data;
	},
};

function getUserData(token) {
	return new Promise(async (resolve, reject) => {
		const response = await fetch(
			`http://192.168.1.100:5000/api/auth/user/${token}`
		);
		if (response.ok) {
			const data = await response.json();
			resolve(data);
		} else {
			reject("error occured");
		}
	});
}

function saveUsersData(token, userData) {
	return new Promise(async (res, rej) => {
		const response = await fetch(
			"http://192.168.1.100:5000/api/auth/save",
			{
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				method: "POST",
				body: JSON.stringify({
					token: token,
					userData: userData,
				}),
			}
		);
		if (response.ok) {
			const data = await response.json();
			res(data);
		} else {
			rej("error occured");
		}
	});
}
