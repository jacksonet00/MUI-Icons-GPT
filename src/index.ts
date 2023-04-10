import express from "express";

const app = express();
const port = 5000;

// define a route handler for the default home page
app.get("/", (req, res) => {
	res.send("Hello world!");
});

// start the Express server
app.listen(port, () => {
	console.log(`Started at: http://localhost:${port}`);
});