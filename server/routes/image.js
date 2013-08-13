'use strict';

var async = require('async');

var ctrl = require(__dirname + '/../controllers/image');

module.exports = {
	list: function(request, response) {
		ctrl.listImageURLs(function(urls) {
			response.send({
				images: urls
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
		} else response.sendFile(ctrl.getImagePath());
	},

	post: function(request, response) {
		ctrl.create(request.files.image.name, request.files.imagepath, function(error, url) {
			if(error instanceof ctrl.ConflictError) {
				response.send(409, error);
				console.error(JSON.stringify(error));
			} else if(error) {
				response.send(500);
				console.error(JSON.stringify(error));
			} else
				response.send(201, url);
		});
	}
};
