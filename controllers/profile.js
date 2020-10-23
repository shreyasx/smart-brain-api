const handleProfile = (req, res, postgres) => {
	const { id } = req.params;
	postgres
		.select('*')
		.from('users')
		.where({ id })
		.then(user => {
			if (user.length) res.json(user[0]);
			else res.status(400).json('not found user');
		})
		.catch('error getting profile');
};

module.exports = { handleProfile };
