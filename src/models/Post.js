const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	description: {
		type: String
	},
	url: {
		type: String,
		required: true
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'users'
	}
});

module.exports = Post = mongoose.model('post', PostSchema);
