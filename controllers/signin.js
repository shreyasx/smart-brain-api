const jwt = require("jsonwebtoken");
const redis = require("redis");
const redisClient = redis.createClient({ host: process.env.REDIS_URI });

const handleSignIn = (postgres, bcrypt, req) =>
	new Promise((resolve, reject) => {
		if (!req.body.email || !req.body.password)
			return reject({ error: "Wrong credentials." });
		postgres
			.select("email", "hash")
			.from("login")
			.where("email", "=", req.body.email)
			.then(data => {
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
				reject({ error: "Wrong credentials." });
			});
	});

const createSessions = user => {
	const { email, id } = user;
	const token = jwt.sign({ email }, process.env.JWTsecret, {
		expiresIn: "2 days",
	});
	return { success: true, userId: id, token };
};

const getAuthTokenId = () => console.log("yo auth k");

const signinAuth = (postgres, bcrypt, app) => (req, res) => {
	const { authorization } = req.headers;
	return authorization
		? getAuthTokenId()
		: handleSignIn(postgres, bcrypt, req)
				.then(
					data =>
						new Promise((resolve, reject) =>
							data.id && data.email
								? resolve(createSessions(data))
								: reject(data)
						)
				)
				.then(sess => res.json(sess))
				.catch(console.log);
};

module.exports = { signinAuth };
