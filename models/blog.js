const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
	title: {
		type: String,
		minlength: 1
	},
	author: String,
	url: String,
	likes: Number,
	user: {
		type: mongoose.Schema.Types.ObjectID,
		ref: 'User'
	},
	comments: Array
});

blogSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	}
});

module.exports = mongoose.model('Blog', blogSchema);