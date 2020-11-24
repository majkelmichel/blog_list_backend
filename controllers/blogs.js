const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({});
	response.json(blogs);
});

blogsRouter.post('/', (request, response, next) => {
	const blog = new Blog(request.body);

	blog
		.save()
		.then(result => {
			response.json(result);
		})
		.catch(next);
});

module.exports = blogsRouter;
