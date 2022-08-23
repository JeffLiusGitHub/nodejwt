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
app.listen(3000);

const auth = (req, res, next) => {
    // console.log(req.headers)
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];
	if (token == null) return res.sendStatus(401);
	// console.log(token);
	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		if (err) {
			// console.log(err);
			return res.sendStatus(403);
		}
		// console.log(user);
		req.user = user;
		next();
	});
};
const posts = [
	{ username: 'jeff', title: 'p1' },
	{ username: 'jasmine', title: 'p2' },
];

app.get('/posts', jsonParser, auth, (req, res) => {
    console.log("test"+req.user.username)
	res.json(posts.filter((post) => post.username === req.user.name));
});

app.post('/login', jsonParser, (req, res) => {
	//AUTH
    //todo
	console.log(req.body);
	const username = req.body.username;
	// const username = 'jeff'

	const user = { name: username };
	const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: '1h',
	});
	res.json({ accessToken: accessToken });
});
