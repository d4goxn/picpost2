'use strict';

var async = require('async');

var ctrl = require(__dirname + '/../controllers/image');

module.exports = {
	list: function(request, response) {
		ctrl.listImageURLs(function(urls, thumbUrls) {
			response.send({
				images: urls,
				thumbs: thumbUrls
			});
		});
	},

	get: function(request, response) {
		// If the request accepts json, send image metadata. Otherwise, send the image itself.
		if(request.accepts('json')) {
			ctrl.getImageURL(request.params.name, function(error, url) {
				if(error instanceof ctrl.DoesNotExistError) {
					response.send(404, error);
					console.error(JSON.stringify(error));
				} else if(error) {
					response.send(500);
				} else {
					response.send({
						imageURL: url
					});
				}
			});
		} else {
			// TODO: Separate image controller and routes from thumb controller and routes.
			ctrl.getImagePath(request.params.name, function(path) {
				response.sendFile();
			});
		}
	},

	post: function(request, response) {
		if(request.files.image && request.files.thumb) {
			ctrl.create({
				imageName: request.files.image.name,
				imagePath: request.files.image.path,
				thumbName: request.files.thumb.name,
				thumbPath: request.files.thumb.path
			}, function(error, url) {
				if(error instanceof ctrl.ConflictError) {
					response.send(409, error);
					console.error(JSON.stringify(error));
				} else if(error) {
					response.send(500);
					console.error(JSON.stringify(error));
				} else
					response.send(201, url);
			});
		} else response.send(403, 'Missing image or missing image thumbnail.');
	}
};
