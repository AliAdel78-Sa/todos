import { notify } from "./modules/notify.js";

const signupBtn = document.getElementById("signup-btn");
const email = document.getElementById("email-input");
const password = document.getElementById("password-input");
const firstName = document.getElementById("firstname-input");
const lastName = document.getElementById("lastname-input");
const showPassword = document.getElementById("showPassword");
const hidePassword = document.getElementById("hidePassword");
const loading = document.getElementById("loading");
hidePassword.addEventListener("click", hidePass);
showPassword.addEventListener("click", showPass);

const validEmailRegEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const validPassRegex = /^(?=.*[A-Za-z])(?=.*\d).+$/;
function hidePass() {
	hidePassword.style.display = "none";
	showPassword.style.display = "block";
	password.type = "password";
	password.focus();
}
function showPass() {
	hidePassword.style.display = "block";
	showPassword.style.display = "none";
	password.type = "text";
	password.focus();
}
signupBtn.addEventListener("click", () => {
	if (String(email.value.trim()).match(validEmailRegEx) === null) {
		notify(
			"Invalid Email",
			"Email Should Look Like 'example@gmail.com' ",
			"danger",
			3
		);
		return;
	} else if (password.value.length < 10) {
		notify(
			"Invalid Password Characters",
			"Password Must Be 10 or More Characters",
			"danger",
			3
		);
		return;
	} else if (String(password.value).match(validPassRegex) === null) {
		notify(
			"Invalid Password",
			"Password Must Include Letters & Numbers",
			"danger",
			3
		);
		return;
	} else if (firstName.value.length === 0) {
		notify("Invalid Name", "Please Provide Your First Name", "danger", 3);
		return;
	} else if (lastName.value.length === 0) {
		notify("Invalid Name", "Please Provide Your Last Name", "danger", 3);
		return;
	}
	loading.classList.remove("hide");
	signUp()
		.then((data) => {
			loading.classList.add("hide");
			storage.set("welcomed", null);
			notify(
				data.message.split(",")[0],
				data.message.split(",")[1],
				"success",
				5
			);
		})
		.catch((e) => {
			loading.classList.add("hide");
			const title = e.split(",")[0];
			const body = e.split(",")[1];
			notify(title, body, "danger", 5);
		});
});

function signUp() {
	return new Promise(async (res, rej) => {
		try {
			const response = await fetch(
				"http://192.168.1.100:5000/api/auth/signup",
				{
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
					},
					method: "POST",
					body: JSON.stringify({
						email: email.value.trim(),
						password: password.value.trim(),
						firstName: firstName.value.trim(),
						lastName: lastName.value.trim(),
					}),
				}
			);
			if (!response.ok) {
				if (response.status === 400) {
					rej("Email Already Registered, Try Logging In");
				} else {
					rej("Error, Server Error");
				}
			} else {
				const data = await response.json();
				res(data);
			}
		} catch (e) {
			console.log(e);
		}
	});
}
