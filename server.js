require("dotenv").config();

const express = require("express");
const cors = require("cors");
const knex = require("knex");
const bcrypt = require("bcrypt-nodejs");
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");
const auth = require("./controllers/auth");
const morgan = require("morgan");
const compression = require("compression");
const helmet = require("helmet");
const { signout } = require("./controllers/signout");
const app = express();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const postgres = knex({
	client: "pg",
	connection: {
		connectionString: process.env.POSTGRES_URI,
		ssl: true,
	},
});

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("tiny"));
app.use(helmet());
app.use(compression());

app.get("/", (req, res) => {
	res.send(
		"<h1>API of the <a href='https://shreyasx-smart-brain.netlify.app/'>Smart Brain</a> WebApp.</h1>"
	);
});

app.post("/signin", signin.signinAuth(postgres, bcrypt));

app.post("/register", (req, res) => {
	register.handleRegister(req, res, postgres, bcrypt);
});

app.get("/profile/:id", auth.requireAuth, (req, res) => {
	profile.handleProfile(req, res, postgres);
});

app.post("/profile/:id", auth.requireAuth, (req, res) => {
	profile.handleProfileUpdate(req, res, postgres);
});

app.get("/profile/photo/:id", auth.requireAuth, (req, res) => {
	profile.getPhoto(req, res, postgres);
});

app.put("/image", auth.requireAuth, (req, res) => {
	image.image(req, res, postgres);
});

app.post("/imageurl", auth.requireAuth, (req, res) => {
	image.handleApiCall(req, res);
});

app.get("/signout", auth.requireAuth, signout);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`App on port ${PORT}.`);
});
