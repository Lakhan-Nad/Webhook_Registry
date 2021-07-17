const express = require("express");

const app = express();

app.use((req, res) => {
	console.log(req.originalURL);
	console.log(req.ip);
	console.log(req.headers);
	res.status(404).end();
});

app.listen(6002, () => {
	console.log("Mock server is listening on port 6002");
	console.log("I always return 404 not found response");
});
