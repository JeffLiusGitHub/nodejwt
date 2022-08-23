require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.json());
var jsonParser = bodyParser.json();
const jwt = require('jsonwebtoken');
app.use(express.json());
app.listen(4000);

let refeshTokens = [];

const auth = (req, res, next) => {
	console.log(req.headers);
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];
	if (token == null) return res.sendStatus(401);
	console.log(token);
	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		if (err) {
			console.log(err);
			return res.sendStatus(403);
		}
		console.log(user);
		req.user = user;
		next();
	});
};

const generateAccessToken = (user) => {
	return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: '15s',
	});
};

// app.get('/posts', jsonParser, auth, (req, res) => {
// 	res.json(posts.filter((post) => post.username === req.user.name));
// });

app.post('/token', (req, res) => {
	const refeshToken = req.body.token;
	// console.log(refeshToken);
	if (refeshToken === undefined) {
		return res.sendStatus(401);
	}
	console.log(refeshToken);
	console.log(refeshTokens);
	if (!refeshTokens.includes(refeshToken)) {
		return res.sendStatus(403);
	}
	jwt.sign(refeshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
		if (err) {
			// console.log(err);
			return sendStatus(403);
		}
		console.log(user);
		const accessToken = generateAccessToken({ name: user.name });
		return res.json({ accessToken: accessToken });
	});
	// refeshTokens.push(refeshToken);

	// res.json({ response: refeshToken });
});

app.post('/login', jsonParser, (req, res) => {
	//AUTH
	//todo
	console.log(req.body);
	const username = req.body.username;
	// const username = 'jeff'

	const user = { name: username };
	const accessToken = generateAccessToken(user);
	const refeshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
	refeshTokens.push(refeshToken);
	console.log(refeshTokens);
	res.json({ accessToken: accessToken, refreshToken: refeshToken });
});

app.delete('/logout', (req, res) => {
	refeshTokens = refeshTokens.filter((token) => token !== req.body.token);
	res.sendStatus(204);
});
