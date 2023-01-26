const mongoose = require('mongoose');

const Spotify = mongoose.model(
	'Spotify',
	new mongoose.Schema({
		token: String,
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	})
);

module.exports = Spotify;
