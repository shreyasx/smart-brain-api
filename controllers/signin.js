const jwt = require("jsonwebtoken");
const redis = require("redis");
const redisClient = redis.createClient({
	host: process.env.REDIS_URI,
	port: process.env.REDIS_PORT,
	password: process.env.REDIS_PASS,
});

const handleSignIn = (postgres, bcrypt, req) =>
	new Promise((resolve, reject) => {
		if (!req.body.email || !req.body.password)
			return reject({ error: "Invalid data." });
		postgres
			.select("email", "hash")
			.from("login")
			.where("email", "=", req.body.email)
			.then(data => {
				if (!data[0]) return reject({ error: "Wrong credentials." });
				if (bcrypt.compareSync(req.body.password, data[0].hash))
					return postgres
						.select("*")
						.from("users")
						.where("email", "=", req.body.email)
						.then(user => {
							resolve(user[0]);
						});
				else reject({ error: "Wrong credentials." });
			})
			.catch(e => {
				console.log(e);
				reject({ error: "An unkown error occured." });
			});
	});

const setToken = (token, id) =>
	new Promise((resolve, reject) => {
		redisClient.set(token, id) ? resolve() : reject();
	});

const createSessions = async user => {
	const { email, id } = user;
	const token = jwt.sign({ email }, process.env.JWTsecret, {
		expiresIn: "2 days",
	});
	try {
		await setToken(token, id);
		return { success: true, userId: id, token };
	} catch (e) {
		console.log(e);
	}
};

const getAuthTokenId = authorization =>
	new Promise((resolve, reject) => {
		redisClient.get(authorization, (err, reply) => {
			if (err) return reject({ error: "An unkown error occured." });
			if (!reply) return reject({ error: "Unauthorized." });
			return resolve({ success: true, userId: reply });
		});
	});

const signinAuth = (postgres, bcrypt) => (req, res) => {
	const { authorization } = req.headers;
	return authorization
		? getAuthTokenId(authorization)
				.then(data => res.json(data))
				.catch(err => res.status(400).json({ ...err, success: false }))
		: handleSignIn(postgres, bcrypt, req)
				.then(
					data =>
						new Promise((resolve, reject) =>
							data.id && data.email
								? resolve(createSessions(data))
								: reject({ error: "An unkown error occured." })
						)
				)
				.then(sess => res.json(sess))
				.catch(err => res.status(400).json({ ...err, success: false }));
};

module.exports = { signinAuth, redisClient, setToken, createSessions };
