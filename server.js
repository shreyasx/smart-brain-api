require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const cookieSession = require("cookie-session");
const knex = require("knex");
const bcrypt = require("bcrypt-nodejs");
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");
const morgan = require("morgan");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const postgres = knex({
	client: "pg",
	connection: {
		connectionString: process.env.POSTGRES_URI,
		ssl: true,
	},
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan("combined"));
app.use(
	cookieSession({
		name: "session",
		keys: ["hahahaha", "boooo"],
	})
);

app.get("/", (req, res) => {
	postgres
		.select("*")
		.from("users")
		.then(resp => res.json(resp));
});

app.post("/signin", (req, res) => {
	signin.handleSignIn(req, res, postgres, bcrypt);
});

app.post("/register", (req, res) => {
	register.handleRegister(req, res, postgres, bcrypt, app);
});

app.get("/profile/:id", (req, res) => {
	profile.handleProfile(req, res, postgres);
});

app.put("/image", (req, res) => {
	image.image(req, res, postgres);
});

app.post("/imageurl", (req, res) => {
	image.handleApiCall(req, res);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`App on port ${PORT}.`);
});
