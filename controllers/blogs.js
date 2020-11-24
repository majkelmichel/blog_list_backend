const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({});
	response.json(blogs);
});

blogsRouter.post('/', async (request, response, next) => {
	const body = request.body;
	if (!body.hasOwnProperty('likes')) {
		body.likes = 0;
	}
	const blog = new Blog(body);
	const createdBlog = await blog.save();
	response.json(createdBlog);
});

module.exports = blogsRouter;
