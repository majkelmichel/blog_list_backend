const bcrypt = require('bcrypt');
const User = require('../models/user');
const helper = require('./test_helper');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);

describe('when there is one user in DB', () => {
	beforeEach(async () => {
		await User.deleteMany({});

		const passwordHash = await bcrypt.hash('sekret', 10);
		const user = new User({ username: 'root', passwordHash });

		await user.save();
	});

	test('can create user with unique username', async () => {
		const usersAtStart = await helper.usersInDB();

		const newUser = {
			username: 'uniqueTest',
			name: 'Unique Test',
			password: 'unique',
		};

		await api
			.post('/api/users')
			.send(newUser)
			.expect(200)
			.expect('Content-Type', /application\/json/);

		const usersAtEnd = await helper.usersInDB();
		expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);
		expect(usersAtEnd.map(u => u.username)).toContain(newUser.username);
	})
})