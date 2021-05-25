const handleProfile = (req, res, postgres) => {
	const { id } = req.params;
	postgres
		.select("*")
		.from("users")
		.where({ id })
		.then(user => {
			if (user.length) res.json(user[0]);
			else res.status(400).json("not found user");
		})
		.catch("error getting profile");
};

const handleProfileUpdate = (req, res, postgres) => {
	const { id } = req.params;
	const { name, age, pet } = req.body.formInput;
	console.log(age, pet);
	postgres("users")
		.where({ id })
		.update({ name })
		.returning("*")
		.then(resp => {
			if (resp) return res.json({ ...resp[0], age, pet });
			return res.status(400).json({ error: "errorrrrrr" });
		})
		.catch(console.log);
};

module.exports = { handleProfile, handleProfileUpdate };
