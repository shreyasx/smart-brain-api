const Clarifai = require("clarifai");

const app = new Clarifai.App({
	apiKey: process.env.CLARIFAI_API_KEY,
});

const handleApiCall = (req, res) => {
	app.models
		.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
		.then(data => res.json(data))
		.catch(err => res.status(400).json("unable to work w api"));
};

const image = (req, res, postgres) => {
	const { id } = req.body;
	postgres("users")
		.where("id", "=", id)
		.increment("entries", 1)
		.returning("entries")
		.then(en => res.json(en))
		.catch(e => res.status(400).json("unable to get entries"));
};

module.exports = { image, handleApiCall };
