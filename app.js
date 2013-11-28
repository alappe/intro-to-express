var StatsD = require('node-statsd').StatsD;
var client = new StatsD();

var express = require('express');
var app = express();

var hbs = require('hbs');

var blogEngine = require('./blog');

app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.use(express.bodyParser());

app.use(express.static('public'));

app.get('/', function(req, res) {
	client.increment('homepage');
	res.render('index',{title:"My Blog", entries:blogEngine.getBlogEntries()});
});

app.get('/about', function(req, res) {
	client.increment('about');
	res.render('about', {title:"About Me"});
});

app.get('/article/:id', function(req, res) {
	client.increment('article');
	client.increment('article-'+req.params.id);
	var base = Date.now();
	setTimeout(function() {
		client.timing('db-response-time', base-Date.now());
		var entry = blogEngine.getBlogEntry(req.params.id);
		res.render('article',{title:entry.title, blog:entry});
	}, Math.random() * 1000);
});

app.listen(3000);
