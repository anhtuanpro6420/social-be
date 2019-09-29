const validatePostInput = require('../validation/post');

module.exports.test = (req, res) => res.json({ msg: 'Posts works' });

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

module.exports.getAll = (req, res) => {
	Post.find()
		.sort({ date: -1 })
		.then(posts => res.json(posts))
		.catch(err =>
			res.status(404).json({
				message: 'No posts found'
			})
		);
};

module.exports.findById = (req, res) => {
	Post.findById(req.params.id)
		.then(post => res.json(post))
		.catch(err =>
			res.status(404).json({
				nopostfound: 'No post found with this id'
			})
		);
};

module.exports.deleteById = (req, res) => {
	Profile.findOne({ user: req.user.id }).then(profile => {
		Post.findById(req.params.id)
			.then(post => {
				if (post.user.toString() !== req.user.id) {
					return res
						.status(401)
						.json({ notauthorized: 'Not authorized' });
				}
				post.remove().then(() => res.json({ success: true }));
			})
			.catch(err =>
				res.status(404).json({
					nopostfound: 'No post found with this id'
				})
			);
	});
};
