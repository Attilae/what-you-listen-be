require('dotenv').config();

module.exports = {
	USERNAME: process.env.DB_USER,
	PWD: process.env.DB_PASS,
	HOST: process.env.DB_HOST,
	PORT: 27017,
	DB: process.env.DB_DB,
};
