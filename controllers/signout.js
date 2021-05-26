const { redisClient } = require("./signin");

exports.signout = (req, res) => {
	const { authorization } = req.headers;
	res.json(redisClient.del(authorization));
};
