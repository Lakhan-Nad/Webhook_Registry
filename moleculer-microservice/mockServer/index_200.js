const express = require("express");

const app = express();

app.use((req, res) => {
	console.log(req.originalURL);
	console.log(req.ip);
	console.log(req.headers);
	res.status(200).end();
});

app.listen(6000, () => {
	console.log("Mock server is listening on port 6000");
	console.log("I always return 200 success");
});
