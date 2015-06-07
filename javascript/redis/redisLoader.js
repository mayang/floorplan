var redis = require('redis');
var directoryModule = require('./directory');

var client = redis.createClient();
var directory = directoryModule.directory;

directory.forEach(function(unit, i) {
	// debugger
	var name = unit['firstName'] + ' ' + unit['lastName'];
	var spaceNo = String(unit['spaceNumber']);
	var floorNo = String(unit['floorNumber']);
	client.set(name, spaceNo);
	// TODO - lists if more than one person in a room
	client.hmset(spaceNo, 'name', name, 'floor', floorNo);
});

client.quit();
