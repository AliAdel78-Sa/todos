const loginBtn = document.getElementById("login-btn");
const email = document.getElementById("email-input");
const password = document.getElementById("password-input");
const showPassword = document.getElementById("showPassword");
const hidePassword = document.getElementById("hidePassword");

hidePassword.addEventListener("click", hidePass);
showPassword.addEventListener("click", showPass);

function hidePass() {
	hidePassword.style.display = "none";
	showPassword.style.display = "block";
	password.type = "password";
}
function showPass() {
	hidePassword.style.display = "block";
	showPassword.style.display = "none";
	password.type = "text";
}

loginBtn.addEventListener("click", () => {
	if (email.value.trim().length > 0 && password.value.trim().length > 0) {
		login()
			.then((data) => {
				localStorage.setItem("token", JSON.stringify(data.token));
				window.location.assign("/");
			})
			.catch((e) => alert(e));
	}
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
					rej("User not Found, Try Signing Up Instead");
				} else if (response.status === 401) {
					rej("Invalid Password");
				} else {
					rej("Error");
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
