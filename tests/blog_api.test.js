const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);

const Blog = require('../models/blog');

beforeEach(async () => {
	await Blog.deleteMany({});

	for (const blog of helper.initialBlogs) {
		let blogObj = new Blog(blog);
		await blogObj.save();
	}
});

describe('blogs', () => {
	test('are returned as json', async () => {
		await api
			.get('/api/blogs')
			.expect(200)
			.expect('Content-Type', /application\/json/);
	});

	test('api returns correct amount of blogs', async () => {
		const res = await api
			.get('/api/blogs')
			.expect(200);
		expect(res.body.length).toBe(helper.initialBlogs.length);
	});
});

describe('format of returned blogs', () => {
	test('blogs have id attribute', async () => {
		const res = await api
			.get('/api/blogs')
			.expect(200);
		for (const blog of res.body) {
			expect(blog.id).toBeDefined();
		}
	});
});


afterAll(() => {
	mongoose.connection.close();
});