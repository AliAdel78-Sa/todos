const signupBtn = document.getElementById("signup-btn");
const email = document.getElementById("email-input");
const password = document.getElementById("password-input");
const firstName = document.getElementById("firstname-input");
const lastName = document.getElementById("lastname-input");

signupBtn.addEventListener("click", () => {
	signUp()
		.then((data) => {
			alert(data.message);
		})
		.catch((e) => {
			alert(e);
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
					rej("Error");
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
