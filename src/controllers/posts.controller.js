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
		return res.status(404).json({ profile: 'No post found' });
	}
};

module.exports.getDetail = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id).populate({
			path: 'favorites',
			model: 'users',
			select: 'email'
		});
		return res.json(post);
	} catch {
		return res.status(404).json({ profile: 'Post not found' });
	}
};

module.exports.favorites = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id).populate('user', [
			'email'
		]);
		userIndex = post.favorites.findIndex(
			item => item.toString() === req.body._id
		);
		if (userIndex < 0) {
			post.favorites.push(req.body._id);
		} else {
			post.favorites.splice(userIndex, 1);
		}
		const data = await post.save();
		return res.status(200).json(data);
	} catch {
		return res.status(404).json({
			message: 'Post not found'
		});
	}
};
