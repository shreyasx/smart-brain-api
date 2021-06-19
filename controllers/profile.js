const handleProfile = (req, res, postgres) => {
	const { id } = req.params;
	postgres
		.select("name", "id", "joined", "entries", "age", "pet")
		.from("users")
		.where({ id })
		.then(user => {
			if (user.length) res.json(user[0]);
			else res.status(400).json("not found user");
		})
		.catch("error getting profile");
};

const getPhoto = async (req, res, postgres) => {
	const { id } = req.params;
	const data = await postgres("users").select("image").where({ id });
	res.json({ image: data[0].image });
};

const handleProfileUpdate = (req, res, postgres) => {
	const { id } = req.params;
	const { name, age, pet, image } = req.body;
	postgres("users")
		.where({ id })
		.update({ name, age, pet, image })
		.returning("*")
		.then(resp => {
			if (resp) return res.json(resp[0]);
			return res.status(400).json({ error: "errorrrrrr" });
		})
		.catch(console.log);
};

module.exports = { handleProfile, getPhoto, handleProfileUpdate };
