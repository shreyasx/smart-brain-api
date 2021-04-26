const handleRegister = (req, res, postgres, bcrypt) => {
	const { email, name, password } = req.body;
	if (!email || !password || !name)
		return res.status(400).json({ error: "Incorrect details" });
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
					.then(u => res.json(u[0]))
					.catch(e => res.json(e))
					.then(trx.commit)
					.catch(trx.rollback);
			})
			.catch(err => {
				console.log(err);
				res.status(400).json({ error: "unable to register" });
			});
	});
};

module.exports = { handleRegister: handleRegister };
