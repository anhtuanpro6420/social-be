const Post = require('../models/Post');
const validatePostInput = require('../validation/post');

module.exports.create = (req, res) => {
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

	newPost.save().then(post => res.json(post));
};

module.exports.getAll = async (req, res) => {
	const posts = await Post.find().sort({ date: -1 });
	const data = await Promise.all(
		posts.map(async item => {
			const userInfo = await User.findById(item.user);
			const publicInfo = await userInfo.getPublicProfile();
			return {
				_id: item._id,
				url: item.url,
				title: item.title,
				description: item.description,
				user: publicInfo
			};
		})
	);
	return res.json(data);
};
