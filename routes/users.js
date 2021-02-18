var express = require('express');
const { route } = require('.');
var router = express.Router();
var User = require('../models/user');

/* GET users listing. */
router.get('/add', function(req, res, next) {
  res.render('users/add', {
    title: 'ユーザー登録',
    err: ''
  });
});

router.post('/add', (req, res, next) => {
  User.create({
    username: req.body.name,
    password: req.body.pass
  }).then((user) => {
    if (!user) {
      res.redirect('/users/add');
    } else{
      res.redirect('/');
    }
  })
  .catch((err) => {
    res.render('users/add', {
      title: 'ユーザー登録',
      err: 'そのユーザー名、またはパスワードは使用できません'
    });
  });
});

router.get('/login', (req, res, next) => {
  res.render('users/login', {
    title: 'ログイン',
    content: ''
  });
});

router.post('/login', (req, res, next) => {
  User.findOne({
    where: {
      username: req.body.name,
      password: req.body.pass
    }
  }).then((user) => {
    if (user !== null) {
      req.session.login = user;
      res.redirect('/');
    } else {
      res.render('users/login', {
        title: 'ログイン',
        content: '名前かパスワードに問題があります。再度入力してください。'
        });
      }
  });
});

router.get('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      res.send(err);
      return;
    }
    res.render('users/logout', {
      title: 'ログアウト',
      content: 'ログアウトしました'
    });
  });
});

router.get('/show', (req, res, next) => {
  User.findAll().then((users) => {
    res.send(users);
  });
});

module.exports = router;
