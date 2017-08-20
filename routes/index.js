var express = require('express');
var router = express.Router();
//var login = require('./routes/login');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/layout', function(req, res, next) {
	  res.render('layout', { title: 'Twitter Lab1 Student010830105 ' });
	});


module.exports = router;
