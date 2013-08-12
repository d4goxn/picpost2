/*global describe, it, before*/
'use strict';

var should = require('should'),
	assert = require('assert'),
	request = require('supertest'),
	fs = require('fs'),
	server = require('../server');

var app = server.start();

function getImageList(done) {
	request(app)
	.get('/images')
	.end(function(error, response) {
		if(error) return done(error);

		response.should.have.status(200);
		response.body.images.should.eql({
			images: ['test image']
		});

		done();
	});
}

function getImage(done) {
	request(app)
	.get(encodeURI('/image/test image'))
	.end(function(error, response) {
		if(error) return done(error);

		response.should.have.status(200);
		response.body.images.should.eql({
			imageUrl: encodeURI('test image.png')
		});

		done();
	});
}

describe('Log', function() {
	it('should return an empty list when requesting pics from an empty document', function(done) {
		request(app)
		.get('/images')
		.end(function(error, response) {
			if(error) done(JSON.stringify(error));

			response.should.have.status(200);
			console.log(typeof response.body.images);
			response.body.should.have.property('images');
			done();
		});
	});

	it('should return a success code when an image is posted', function(done) {
		request(app)
		.post('/image')
		.attach('image', __dirname + '/sampleImage.png')
		.field('name', 'test pic')
		.end(function(error, response) {
			if(error) done(JSON.stringify(error));

			response.should.have.status(200);

			done();
		});
	});

	it('should be able to get a lists of images after posting an image, and get an image from the list', function(done) {
		request(app)
		.post('/image')
		.attach('image', __dirname + '/sampleImage.png')
		.field('name', 'test pic')
		.end(function(error, response) {
			if(error) done(JSON.stringify(error));

			var gotImageList = false;
			var gotImage = false;

			function checkDone() {
				if(gotImageList && gotImage) done();
			}

			getImageList(function(error) {
				if(error) return done(error);
				gotImageList = true;
				checkDone();
			});

			getImage(function(error) {
				if(error) return done(error);
				gotImage = true;
				checkDone();
			});
		});
	});
});
