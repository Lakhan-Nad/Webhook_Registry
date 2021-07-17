const express = require("express");

const app = express();

app.use((req, res) => {
	console.log(req.originalURL);
	console.log(req.ip);
	console.log(req.headers);
	setTimeout(() => {
		res.status(200).end();
	}, 1500);
});

app.listen(6003, () => {
	console.log("Mock server is listening on port 6003");
	console.log("I always return return response after 1500 ms");
});
