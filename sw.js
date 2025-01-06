self.addEventListener("install", (e) => {
	e.waitUntil(
		caches.open("static").then((cache) => {
			return cache.addAll([
				"./index.html",
				"./css/main.css",
				"./js/app.js",
				"./js/UI.js",
			]);
		})
	);
});

// self.addEventListener("fetch", (e) => {
// 	console.log("Fetch Request: " + e.request.url);
// });
