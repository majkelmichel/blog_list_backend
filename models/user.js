const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
	username: {
		type: String,
		unique: true,
		required: true,
		minlength: 3,
	},
	name: String,
	passwordHash: String,
});

userSchema.set('toJSON', {
	transform: (doc, returnedObj) => {
		returnedObj.id = returnedObj._id.toString();
		delete returnedObj._id;
		delete returnedObj.__v;
		delete returnedObj.passwordHash;
	}
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);