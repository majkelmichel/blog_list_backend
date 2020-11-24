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

describe('creating blogs', () => {
	test('POST request with valid data creates a new blog', async () => {
		const newBlog = {
			'title': 'Writing tests in Jest',
			'author': 'majkelmichel',
			'url': 'http://localhost:3003/jest_tests',
			'likes': 5,
		};
		await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(200)
			.expect('Content-Type', /application\/json/);

		const blogsAfter = await helper.blogsInDB();
		expect(blogsAfter).toHaveLength(helper.initialBlogs.length + 1);

		const titles = blogsAfter.map(b => b.title);
		expect(titles).toContain('Writing tests in Jest');
	});

	test('if blog has no likes property, set it to 0', async () => {
		const newBlog = {
			'title': 'Writing tests in Jest',
			'author': 'majkelmichel',
			'url': 'http://localhost:3003/jest_tests',
		};
		const res = await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(200)
			.expect('Content-Type', /application\/json/);

		expect(res.body.likes).toBeDefined();
		expect(res.body.likes).toBe(0);
	});

	test('if blog has no title, return 400 Bad Request', async () => {
		const newBlog = {
			'author': 'majkelmichel',
			'url': 'http://localhost:3003/jest_tests',
		};
		await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(400);
	});

	test('if blog has no url, return 400 Bad Request', async () => {
		const newBlog = {
			'title': 'Writing tests in Jest',
			'author': 'majkelmichel',
		};
		await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(400);
	});
});


afterAll(() => {
	mongoose.connection.close();
});