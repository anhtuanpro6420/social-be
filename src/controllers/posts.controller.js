const Post = require('../models/Post');
const validatePostInput = require('../validation/post');

module.exports.create = async (req, res) => {
	const { errors, isValid } = validatePostInput(req.body);

	if (!isValid) {
		return res.status(400).json(errors);
	}
	const newPost = new Post({
		title: req.body.videoInfo.title,
		description: req.body.videoInfo.description,
		url: req.body.url,
		user: req.user.id
	});

	const post = await newPost.save();
	return res.status(201).json(post);
};

module.exports.getAll = async (req, res) => {
	try {
		const posts = await Post.find().populate('user', ['email']);
		return res.json(posts);
	} catch {
		return res.status(404).json({ message: 'No post found' });
	}
};
