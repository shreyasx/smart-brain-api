const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt-nodejs');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const postgres = knex({
	client: 'pg',
	connection: {
		host: '127.0.0.1',
		user: '',
		password: '',
		database: 'smart-brain',
	},
});

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
	res.json('hi baby');
	postgres
		.select('*')
		.from('users')
		.then(resp => res.json(resp));
});

app.post('/signin', (req, res) => {
	signin.handleSignIn(req, res, postgres, bcrypt);
});

app.post('/register', (req, res) => {
	register.handleRegister(req, res, postgres, bcrypt, app);
});

app.get('/profile/:id', (req, res) => {
	profile.handleProfile(req, res, postgres);
});

app.put('/image', (req, res) => {
	image.image(req, res, postgres);
});

app.post('/imageurl', (req, res) => {
	image.handleApiCall(req, res);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`app on port ${PORT}.`);
});
