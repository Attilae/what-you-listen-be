const controller = require('../controllers/spotify.controller');

const {authJwt} = require('../middlewares');

module.exports = function (app) {
	app.get('/api/spotify/login', authJwt.verifyToken, controller.login);
	app.get('/api/spotify/callback', authJwt.verifyToken, controller.callback);
	app.post('/api/spotify/search', authJwt.verifyToken, controller.search);
};
