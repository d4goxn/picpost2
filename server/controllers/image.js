'use strict';

var images = {};

module.exports = {
	listImageURLs: function(done) {
		console.log(JSON.stringify(images));
		var urls = [];

		Object.keys(images).forEach(function(name) {
			urls.push(images[name]);
		});

		done(urls);
	},

	create: function(name, path, done) {
		// express.bodyParser has already saved the file.
		console.log(JSON.stringify(images));
		if(!(name in images))
			images[name] = path;
		else if(done)
			done(new module.exports.ConflictError(name));
	},

	getImageURL: function(name, done) {
		console.log(JSON.stringify(images));
		if(name in images)
			done(null, '/image/' + name);
		else if(done)
			done(new module.exports.DoesNotExistError(name));
	},

	getImagePath: function(name, done) {
		console.log(JSON.stringify(images));
		if(name in images)
			done(null, images[name]);
		else if(done)
			done(new module.exports.DoesNotExistError(name));
	},

	DoesNotExistError: function(name) {
		this.message = name + ' does not exist.';
	},

	ConflictError: function(name) {
		this.message = name + ' already exists. Save under a different name or update the existing image.';
	}
};
