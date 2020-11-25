const usersRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

usersRouter.get('/', async (req, res) => {
	const users = await User
		.find({}).populate('blogs', { title: 1, url: 1, likes: 1});

	res.json(users);
})

usersRouter.post('/', async (req, res) => {
	const body = req.body;
	if (!body.hasOwnProperty('username') || !body.hasOwnProperty('password')) {
		return res.status(400).json({ error: 'username or password not provided' });
	}

	if (body.password.length < 3) {
		return res.status(400).json({ error: 'password has to be at least 3 characters long' });
	}

	const passwordHash = await bcrypt.hash(body.password, 10);


	const newUser = new User({
		username: body.username,
		name: body.name,
		passwordHash
	});

	const saved = await newUser.save();
	res.json(saved);
});

module.exports = usersRouter;