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

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog
}