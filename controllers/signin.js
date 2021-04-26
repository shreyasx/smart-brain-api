const handleSignIn = (req, res, postgres, bcrypt) => {
	if (!req.body.email || !req.body.password)
		return res.status(400).json({ error: "Wrong credentials." });
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
						res.json(user[0]);
						req.session.userId = user[0].id;
					});
			else res.status(400).json({ error: "Wrong credentials." });
		})
		.catch(e => {
			console.log(e);
			res.status(400).json({ error: "Wrong credentials." });
		});
};

module.exports = { handleSignIn };
