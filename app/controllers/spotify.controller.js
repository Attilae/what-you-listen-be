const querystring = require('querystring');
const axios = require('axios');
const Spotify = require('../models/spotify.model');
const User = require('../models/user.model');

exports.search = async (req, res) => {
	var token;

	const filter = {user: req.userId};

	await Spotify.findOne(filter).exec(async (err, spotify) => {
		if (err) {
			res.status(500).send({message: err});
			return;
		}
		console.log(spotify);
		token = spotify.token;

		const {searchString} = req.query;
		const url = 'https://api.spotify.com/v1/search';
		const searchQuery = encodeURIComponent(searchString);
		const typeQuery = `type=track`;
		const {data} = await axios.get(`${url}?q=${searchQuery}&${typeQuery}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		console.log(data);
		res.status(200).send(data);
	});
};

exports.login = (req, res) => {
	res.redirect(
		`https://accounts.spotify.com/authorize?${querystring.stringify({
			response_type: 'code',
			client_id: process.env.SPOTIFY_CLIENT_ID,
			redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
		})}`
	);
};

exports.callback = async (req, res) => {
	const {code} = req.query;
	const clientId = process.env.SPOTIFY_CLIENT_ID;
	const secret = process.env.SPOTIFY_CLIENT_SECRET;
	const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;
	const grant_type = 'authorization_code';

	const basicHeader = Buffer.from(`${clientId}:${secret}`).toString('base64');
	const {data} = await axios.post(
		'https://accounts.spotify.com/api/token',
		querystring.stringify({
			grant_type,
			code,
			redirect_uri,
		}),
		{
			headers: {
				Authorization: `Basic ${basicHeader}`,
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		}
	);

	const sessionJWTObject = {
		token: data.access_token,
	};

	User.findById(req.userId).exec(async (err, user) => {
		if (err) {
			res.status(500).send({message: err});
			return;
		}

		const filter = {user: req.userId};
		const update = {token: sessionJWTObject.token};

		let doc = await Spotify.findOneAndUpdate(filter, update, {
			new: true,
			upsert: true,
		});

		return res.redirect('/');
	});
};
