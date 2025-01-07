import { notify } from "./modules/notify.js";
import { storage } from "./modules/storage.js";

const loginBtn = document.getElementById("login-btn");
const email = document.getElementById("email-input");
const password = document.getElementById("password-input");
const showPassword = document.getElementById("showPassword");
const hidePassword = document.getElementById("hidePassword");
const loading = document.getElementById("loading");

const validEmailRegEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

hidePassword.addEventListener("click", hidePass);
showPassword.addEventListener("click", showPass);

function hidePass() {
	hidePassword.style.display = "none";
	showPassword.style.display = "block";
	password.focus();
	password.type = "password";
}
function showPass() {
	password.focus();
	hidePassword.style.display = "block";
	showPassword.style.display = "none";
	password.type = "text";
}

loginBtn.addEventListener("click", () => {
	console.log(String(email.value.trim()).match(validEmailRegEx));

	if (String(email.value.trim()).match(validEmailRegEx) === null) {
		notify(
			"Invalid Email",
			"Email Should Look Like 'example@gmail.com' ",
			"danger",
			3
		);
		return;
	}
	loading.classList.remove("hide");
	login()
		.then((data) => {
			localStorage.setItem("token", JSON.stringify(data.token));
			storage.set("welcomed", null);

			setTimeout(() => {
				window.location.assign("/");
				loading.classList.add("hide");
			}, 1000);
		})
		.catch((e) => {
			console.log(e);

			loading.classList.add("hide");
			const title = e.split(",")[0];
			const body = e.split(",")[1];
			notify(title, body, "danger", 5);
		});
});

function login() {
	return new Promise(async (res, rej) => {
		try {
			const response = await fetch(
				"http://192.168.1.100:5000/api/auth/login",
				{
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
					},
					method: "POST",
					body: JSON.stringify({
						email: email.value.trim(),
						password: password.value.trim(),
					}),
				}
			);
			if (!response.ok) {
				if (response.status === 404) {
					rej(
						"Email is invalid, Try signing up if you don't have an account"
					);
				} else if (response.status === 401) {
					rej("Invalid Password, Please try again");
				} else {
					rej("Error, Server Error");
				}
			} else {
				const data = await response.json();
				res(data);
			}
		} catch (e) {
			document.write(`<h1 style="color: red;">${e}</h1>`);
		}
	});
}
