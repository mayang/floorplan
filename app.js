var express = require('express');
var redis = require('redis');
var bodyParser = require('body-parser');
var engine = require('ejs-locals');
var path = require('path');
var q = require('q');


var db = redis.createClient();
var app = express();
app.engine('ejs', engine);
app.set('views', __dirname + '/templates');
app.set('view engine', 'ejs');
app.set('template_engine', 'ejs');
app.use(express.static('public'));
// app.use(express.static('assets'));
// app.use(express.static('bower_components'));
// app.use(express.static('javascript'));
app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.render('index');
})

// GET

// get name at cube no
app.get('/cube/:id', function(req, res, next) {
	db.hget(String(req.params.id), 'name', function(err, obj) {
		res.send(obj);
	});
});

// get cube no from name
app.get('/cube', function(req, res, next) {
	db.get(req.query.name, function(err, reply) {
		res.send(reply);
	});
});

// get names and cube nos
app.get('/names', function(req, res, next) {
	db.keys('*', function(err, reply) {
		res.send(reply);
	});
});

// returns hash of cube no and name
app.get('/chart', function(req, res, next) {
	var chart = {};
	var promises = [];
	db.keys('*', function(err, reply) {
		reply.forEach(function(key, i) {
			if (!isNaN(key)) {
				// promises.push(q.ninvoke(db, 'hgetall', key));
				promises.push(q.ninvoke(db, 'hgetall', key).then(function(data) {
					// db.hgetall(key, function(err, reply) {
						chart[key] = data;
					// });
				 }));
			}
		});
		q.all(promises).spread(function(results) {
			res.send(chart);
		});
	});
});

// returns hash of cube no and name at some floor
app.get('/chart/:floor', function(req, res, next) {
	//TODO
});

// ADD/UPDATE
//add seat no and name
app.post('/cube', function(req, res, next) {
	db.hset(String(req.body.seatNo), 'name', req.body.name, redis.print);
	// db.hset(String(req.body.seatNo), req.body.floorNo, redis.print); // floor?
	db.set(req.body.name, String(req.body.seatNo), redis.print);
	db.hgetall(req.body.seatNo, function(err, obj) {
		res.send(obj);
	});
});

// update seat no and name
app.put('/cube', function(req, res, next) {
	db.hset(String(req.body.seatNo), 'name', req.body.name, redis.print);
	// db.hset(String(req.body.seatNo), req.body.floorNo, redis.print); // floor?
	db.set(req.body.name, String(req.body.seatNo), redis.print);
	db.hgetall(req.body.seatNo, function(err, obj) {
		res.send(obj);
	});
});

// DELETE
app.delete('/cube', function(req, res, next) {
	var seatNo = db.get(req.body.name);
	db.hset(String(req.body.seatNo), 'name', "");
	db.del(req.body.name);
	db.get(req.body.name, function(err, reply) {
		res.send(reply);
	});
});

app.listen(3000);
console.log('listening on port 3000...');
