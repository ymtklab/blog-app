var express = require('express');
var router = express.Router();
var check = require('./check');
var Blog = require('../models/blog');
var User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (check(req, res)){ return };
  Blog.findAll({
    include: [
      {
        model: User,
        attributes: ['userId', 'username']
      }],
    order: [['updatedAt', 'DESC']]
  }).then((blogs) => {
    res.render('index', {
      title: 'ブログ',
      login: req.session.login,
      blogs: blogs
    });
  });
});

module.exports = router;
