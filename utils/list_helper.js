const _ = require('lodash');

const dummy = (blogs) => {
	return 1;
}

const totalLikes = (blogs) => {
	const reducer = (sum, blog) => {
		return sum + blog.likes;
	}

	return blogs.reduce(reducer, 0);
}

const favoriteBlog = (blogs) => {
	const reducer = (top, blog) => {
		if (blog.likes > top.likes) {
			return blog;
		}
		return top;
	}
	const topBlog = blogs.reduce(reducer, {likes: -1});
	return topBlog.likes !== -1
	? {
		title: topBlog.title,
		author: topBlog.author,
		likes: topBlog.likes
	}
	: null
}

const mostBlogs = (blogs) => {
	const blogAuthors = blogs.map(blog => {
		return _.flatten(_.toPairs(_.pick(blog, ['author'])))[1];
	})
	const authors = _.uniq(blogAuthors);
	const authorsObj = authors.map(auth => {
		return {
			author: auth,
			blogs: 0
		};
	})
	blogAuthors.forEach(auth => {
		const index = authorsObj.findIndex(a => {
			return a.author === auth;
		})
		authorsObj[index].blogs++;
	})
	const reducer = (top, obj) => {
		if (obj.blogs > top.blogs) {
			return obj;
		}
		return top;
	}
	const topBlogs = authorsObj.reduce(reducer, { "blogs": -1 })
	return topBlogs.blogs !== -1
	? topBlogs
	: null;
}

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs
}