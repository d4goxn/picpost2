'use strict';

var express = require('express');

var app = express();

app.configure(function() {
	app.use(express.logger());
	app.use(express.bodyParser());
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

app.get('/images', function(request, response) {
	response.send({
		images: []
	});
});

app.post('/image', function(request, response) {
	response.send(200);
});

function start() {
	var port = process.env.port || 3000;
	app.listen(port);
	console.log('Listening on ' + port + ' (' + app.settings.env + ')');

	return app;
}

module.exports = {
	start: start,
	app: app
};
