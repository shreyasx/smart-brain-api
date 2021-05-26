const redisClient = require("./signin").redisClient;

const requireAuth = (req, res, next) => {
	const { authorization } = req.headers;
	if (!authorization) return res.status(401).json({ error: "Unauthorized." });
	return redisClient.get(authorization, (error, reply) => {
		if (error || !reply)
			return res.status(401).json({ error: "Unauthorized." });
		return next();
	});
};

module.exports = { requireAuth };
