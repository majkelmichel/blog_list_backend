const listHelper = require('../utils/list_helper');

const listWithOneBlog = [
	{ _id: "5a422a851b54a676234d17f7", title: "React patterns", author: "Michael Chan", url: "https://reactpatterns.com/", likes: 7, __v: 0 }
];
const listWithBlogs = [
	{
		"_id":"5a422a851b54a676234d17f7",
		"title":"React patterns",
		"author":"Michael Chan",
		"url":"https://reactpatterns.com/",
		"likes":7,
		"__v":0
	},
	{
		"_id":"5a422aa71b54a676234d17f8",
		"title":"Go To Statement Considered Harmful",
		"author":"Edsger W. Dijkstra",
		"url":"http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
		"likes":5,
		"__v":0
	},
	{
		"_id":"5a422b3a1b54a676234d17f9",
		"title":"Canonical string reduction",
		"author":"Edsger W. Dijkstra",
		"url":"http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
		"likes":12,
		"__v":0
	},
	{
		"_id":"5a422b891b54a676234d17fa",
		"title":"First class tests",
		"author":"Robert C. Martin",
		"url":"http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
		"likes":10,
		"__v":0
	},
	{
		"_id":"5a422ba71b54a676234d17fb",
		"title":"TDD harms architecture",
		"author":"Robert C. Martin",
		"url":"http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
		"likes":0,
		"__v":0
	},
	{
		"_id":"5a422bc61b54a676234d17fc",
		"title":"Type wars",
		"author":"Robert C. Martin",
		"url":"http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
		"likes":2,
		"__v":0
	}
];

test('dummy returns one', () => {
	const blogs = [];

	const result = listHelper.dummy(blogs);
	expect(result).toBe(1);
})

describe('total likes', () => {
	test('when list has no blogs', () => {
		expect(listHelper.totalLikes([])).toBe(0);
	})

	test('when list has only one blog, equals the likes of that', () => {
		expect(listHelper.totalLikes(listWithOneBlog)).toBe(7);
	})

	test('when list has multiple blogs, equals to sum of all likes', () => {


		expect(listHelper.totalLikes(listWithBlogs)).toBe(36);
	})
})

describe('favorite blog', () => {
	test('when list has no blogs, return null', () => {
		expect(listHelper.favoriteBlog([])).toBe(null);
	})

	test('when list has one blog, return it', () => {
		expect(listHelper.favoriteBlog(listWithOneBlog)).toEqual({
			title: "React patterns",
			author: "Michael Chan",
			likes: 7
		})
	})

	test('when list has multiple blogs, return blog with most likes', () => {
		const result = listHelper.favoriteBlog(listWithBlogs);
		expect(result).toEqual({
			title: "Canonical string reduction",
			author: "Edsger W. Dijkstra",
			likes: 12
		})
	})
})

describe('top authors', () => {
	test('when list has no blogs, return null', () => {
		expect(listHelper.mostBlogs([])).toBe(null)
	})

	test('when list has one blog, return author of this blog', () => {
		expect(listHelper.mostBlogs(listWithOneBlog)).toEqual({ author: "Michael Chan", blogs: 1 });
	})

	test('when list has multiple blogs, return author with most blogs', () => {
		expect(listHelper.mostBlogs(listWithBlogs)).toEqual({ author: "Robert C. Martin", blogs: 3 });
	})
})

describe('top likes', () => {
	test('when list has no blogs, return null', () => {
		expect(listHelper.mostLikes([])).toBe(null);
	})

	test('when list has one blog, return author of this blog with likes', () => {
		expect(listHelper.mostLikes(listWithOneBlog)).toEqual({ author: "Michael Chan", likes: 7 })
	})

	test('when list has multiple blogs, return author name and amount of likes', () => {
		expect(listHelper.mostLikes(listWithBlogs)).toEqual({ author: "Edsger W. Dijkstra", likes: 17 })
	})
})