const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog
		.find({}).populate('user', { user: 1, username: 1 });
	response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
	const body = request.body;
	if (!body.hasOwnProperty('likes')) {
		body.likes = 0;
	}
	if (!body.hasOwnProperty('title') || !body.hasOwnProperty('url')) {
		return response.status(400).end();
	}
	const user = await User.findOne();
	console.log(body);
	body.user = user._id;

	const blog = new Blog(body);
	const createdBlog = await blog.save();
	user.blogs = user.blogs.concat(createdBlog._id);
	await user.save();

	response.json(createdBlog);
});

blogsRouter.delete('/:id', async (req, res) => {
	await Blog.findByIdAndRemove(req.params.id);
	res.status(204).end();
});

blogsRouter.put('/:id', async (req, res) => {
	const body = req.body;

	const blog = {
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes,
	}

	const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true });
	res.json(updatedBlog);
})

module.exports = blogsRouter;
