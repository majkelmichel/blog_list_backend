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

	test('returns users in DB', async () => {
		const usersAtStart = await helper.usersInDB();
		const users = await api
			.get('/api/users')
			.expect(200)
			.expect('Content-Type', /application\/json/);

		expect(users.body).toHaveLength(usersAtStart.length);
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
	});

	test('cant create user with too short username', async () => {
		const usersAtStart = await helper.usersInDB();

		const newUser = {
			username: 'te',
			name: 'Unique Test',
			password: 'unique',
		};

		await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/);

		const usersAtEnd = await helper.usersInDB();
		expect(usersAtEnd).toHaveLength(usersAtStart.length);
		expect(usersAtEnd.map(u => u.username)).not.toContain(newUser.username);
	});

	test('cant create user with too short password', async () => {
		const usersAtStart = await helper.usersInDB();

		const newUser = {
			username: 'uniqueTest',
			name: 'Unique Test',
			password: 'un',
		};

		await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/);

		const usersAtEnd = await helper.usersInDB();
		expect(usersAtEnd).toHaveLength(usersAtStart.length);
		expect(usersAtEnd.map(u => u.username)).not.toContain(newUser.username);
	});

	test('cant create user without username', async () => {
		const usersAtStart = await helper.usersInDB();

		const newUser = {
			name: 'Unique Test',
			password: 'unique',
		};

		await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/);

		const usersAtEnd = await helper.usersInDB();
		expect(usersAtEnd).toHaveLength(usersAtStart.length);
		expect(usersAtEnd.map(u => u.username)).not.toContain(newUser.username);
	});

	test('cant create user without password', async () => {
		const usersAtStart = await helper.usersInDB();

		const newUser = {
			username: 'uniqueTest',
			name: 'Unique Test',
		};

		await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/);

		const usersAtEnd = await helper.usersInDB();
		expect(usersAtEnd).toHaveLength(usersAtStart.length);
		expect(usersAtEnd.map(u => u.username)).not.toContain(newUser.username);
	});
});

afterAll(() => {
	mongoose.connection.close();
})