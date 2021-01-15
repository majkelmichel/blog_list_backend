const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog
		.find({}).populate('user', { user: 1, username: 1 });
	response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
	const body = request.body;
	const decodedToken = jwt.verify(request.token, process.env.SECRET);
	const user = await User.findById(decodedToken.id);

	if (!body.hasOwnProperty('likes')) {
		body.likes = 0;
	}
	if (!body.hasOwnProperty('title') || !body.hasOwnProperty('url')) {
		return response.status(400).end();
	}

	console.log(body);
	body.user = user._id;
	body.comments = [];

	const blog = new Blog(body);
	const createdBlog = await blog.save();
	user.blogs = user.blogs.concat(createdBlog._id);
	await user.save();

	response.json(createdBlog);
});

blogsRouter.delete('/:id', async (req, res) => {
	const decodedToken = jwt.verify(req.token, process.env.SECRET);
	const user = await User.findById(decodedToken.id);
	if (user.blogs.every(b => b.toString() !== req.params.id)) {
		return res.status(401).json({ error: 'unauthorized to delete the blog' });
	}

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
		comments: body.comments
	};

	const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true });
	res.json(updatedBlog);
});

blogsRouter.post('/:id/comments', async (req, res) => {
	const body = req.body;

	if (!body.hasOwnProperty('comment')) {
		res.status(400).end();
	}

	let blogToUpdate = await Blog.findById(req.params.id);

	if (!blogToUpdate.get('comments')) {
		blogToUpdate.comments = body.comment;
		const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blogToUpdate, { new: true });
		res.send(updatedBlog);
	} else {
		blogToUpdate.comments = [ ...blogToUpdate.comments, body.comment ];
		const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blogToUpdate, { new: true });
		res.send(updatedBlog);
	}
});

module.exports = blogsRouter;
