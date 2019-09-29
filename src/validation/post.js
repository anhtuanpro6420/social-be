const Validator = require('validator');
const isEmpty = require('../validation/is-empty');

module.exports = function validatePostInput(data) {
	let errors = {};
	data.videoInfo.title = !isEmpty(data.videoInfo.title)
		? data.videoInfo.title
		: '';
	data.videoInfo.description = !isEmpty(data.videoInfo.description)
		? data.videoInfo.description
		: '';

	if (Validator.isEmpty(data.videoInfo.title)) {
		errors.message = 'Title field is required';
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
};
