/*global describe, it, before*/
'use strict';

var should = require('should'),
	assert = require('assert'),
	request = require('supertest'),
	fs = require('fs'),
	rimraf = require('rimraf'),
	server = require('../server');

var app = server.app;

describe('Image', function() {
	before(function(done) {
		// Clear the uploads directory before testing.
		rimraf(__dirname + '/../uploads-testing', function() {
			fs.mkdirSync(__dirname + '/../uploads-testing');
			server.start(true); // testing
			done();
		});
	});

	it('should return a success code when a new image is posted', function(done) {

		request(app)
		.post('/image')
		.attach('image', __dirname + '/sampleImage.png')
		.end(function(error, response) {
			if(error) done(error);

			response.should.have.status(201);

			done();
		});
	});

	it('should return an error code when posting a duplicate', function(done) {
		// Fails, see https://github.com/visionmedia/superagent/issues/144
		request(app)
		.post('/image')
		.attach('image', __dirname + '/sampleImage.png')
		.end(function(error, response) {
			if(error) done(error);

			response.should.have.status(409);

			done();
		});
	});

	it('should return a list from /images', function(done) {
		request(app)
		.get('/images')
		.end(function(error, response) {
			if(error) done(error);

			response.should.have.status(200);
			response.body.should.have.property('images');
			done();
		});
	});

	it('should be able to get an image by the same name that it was uploaded under', function(done) {
		request(app)
		.get(encodeURI('/image/sampleImage.png'))
		.end(function(error, response) {
			if(error) done(error);

			response.should.have.status(200);

			done();
		});
	});
});
