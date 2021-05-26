const createSessions = require("./signin").createSessions;

const handleRegister = (req, res, postgres, bcrypt) => {
	const { email, name, password } = req.body;
	if (!email || !password || !name)
		return res.status(400).json({ error: "Invalid data." });
	const hash = bcrypt.hashSync(password);
	postgres.transaction(trx => {
		trx
			.insert({ email, hash })
			.into("login")
			.returning("email")
			.then(loginEmail => {
				return trx("users")
					.returning("*")
					.insert({
						email: loginEmail[0],
						name: name,
						joined: new Date(),
					})
					.then(async u => {
						const sess = await createSessions(u[0]);
						res.json(sess);
					})
					.then(trx.commit)
					.catch(e => {
						trx.rollback();
						console.log(e);
					});
			})
			.catch(err => {
				console.log(err);
				res.status(400).json({ error: "User already exists." });
			});
	});
};

module.exports = { handleRegister };
