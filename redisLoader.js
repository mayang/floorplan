var redis = require('redis');
var directoryModule = require('./directory');

var client = redis.createClient();
var directory = directoryModule.directory;

directory.forEach(function(cube, i) {
	// debugger
	var name = cube['firstName'] + ' ' + cube['lastName'];
	var spaceNo = String(cube['spaceNumber']);
	var floorNo = String(cube['floorNumber']);
	client.set(name, spaceNo);
	// TODO - lists if more than one person in a room
	client.hmset(spaceNo, 'name', name, 'floor', floorNo);
});

client.quit();
