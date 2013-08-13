'use strict';

var images = {};
var thumbs = {};

module.exports = {
	listImageURLs: function(done) {
		var urls = [];
		var thumbUrls = [];

		Object.keys(images).forEach(function(name) {
			urls.push(images[name]);
		});

		Object.keys(thumbs).forEach(function(name) {
			thumbUrls.push(thumbs[name]);
		});

		done(urls, thumbUrls);
	},

	create: function(imageInfo, done) {
		// express.bodyParser has already saved the file.

		if(!(imageInfo.imageName in images))
			images[imageInfo.imageName] = imageInfo.imagePath;
		else if(done)
			done(new module.exports.ConflictError(imageInfo.imageName));

		if(!(imageInfo.thumbName in images))
			thumbs[imageInfo.thumbName] = imageInfo.thumbPath;
		else if(done)
			done(new module.exports.ConflictError(imageInfo.thumbName));
	},

	getImageURL: function(name, done) {
		if(name in images)
			done(null, '/image/' + name);
		else if(done)
			done(new module.exports.DoesNotExistError(name));
	},

	getImagePath: function(name, done) {
		if(name in images)
			done(null, images[name]);
		else if(done)
			done(new module.exports.DoesNotExistError(name));
	},

	getThumbURL: function(name, done) {
		if(name in thumbs)
			done(null, '/thumb/' + name);
		else if(done)
			done(new module.exports.DoesNotExistError(name));
	},

	getThumbPath: function(name, done) {
		if(name in thumbs)
			done(null, thumbs[name]);
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
