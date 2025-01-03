const loginBtn = document.getElementById("login-btn");
const email = document.getElementById("email-input");
const password = document.getElementById("password-input");

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
				"http://localhost:5000/api/auth/login",
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
			window.alert(e);
		}
	});
}
