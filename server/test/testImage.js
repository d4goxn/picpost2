/*global describe, it, before*/
'use strict';

var should = require('should'),
	assert = require('assert'),
	request = require('supertest'),
	fs = require('fs'),
	server = require('../server');

var app = server.start();

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
});
