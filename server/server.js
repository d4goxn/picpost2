'use strict';

var express = require('express');
var image = require('./routes/image');

var app = express();

app.configure(function() {
	app.use(express.logger());

	// When files are uploaded, preserve the extension when creating a unique filename.
	// Beware of DOS potential from file post spam.
	app.use(express.bodyParser({
		keepExtensions: true,
		uploadDir: __dirname + '/uploads' + (app.settings.env === 'development'? '-testing': '')
	}));

	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname + '../client'));
});

app.configure('development', function() {
	app.use(express.errorHandler({
		dumpException: true,
		showStack: true
	}));
});

app.configure('production', function() {
	app.use(express.errorHandler());
});

// API Routes
app.get('/images', image.list);
app.get('/image/:name', image.get);
app.post('/image', image.post);

function start(testing) {
	var port = process.env.port || 3000;
	var server = app.listen(port);
	console.log('Listening on ' + port + ' (' + app.settings.env + ')');

	return server;
}

module.exports = {
	start: start,
	app: app
};
