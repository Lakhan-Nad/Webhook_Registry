const express = require("express");

const app = express();

app.use((req, res) => {
	console.log(req.originalURL);
	console.log(req.ip);
	console.log(req.headers);
	res.status(200).end();
});

app.listen(6001, () => {
	console.log("Mock server is listening on port 6001");
	console.log("I always return 201 status response");
});
