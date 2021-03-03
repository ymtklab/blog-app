var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });
var User = require('../models/user');

// ユーザーの新規登録画面の表示
router.get('/add', csrfProtection, function(req, res, next) {
  res.render('users/add', {
    title: 'ユーザー登録',
    errs: [],
    csrfToken: req.csrfToken()
  });
});

// ユーザーの新規登録処理
router.post('/add', csrfProtection, (req, res, next) => {
  const password = req.body.pass ? bcrypt.hashSync(req.body.pass, 10) : null;
  User.create({
    username: req.body.name,
    password: password
  }).then((user) => {
    if (user) {
      res.redirect('/users/login');
    }
  }).catch(err => {
    res.render('users/add', {
      title: 'ユーザー登録',
      errs: err.errors.map(e => e.message),
      csrfToken: req.csrfToken()
    });
  });
});

// ログインページの表示
router.get('/login', csrfProtection, (req, res, next) => {
  res.render('users/login', {
    title: 'ログイン',
    content: '',
    csrfToken: req.csrfToken()
  });
});

// ログイン処理
router.post('/login', csrfProtection, (req, res, next) => {
  User.findOne({
    where: {
      username: req.body.name
    }
  }).then((user) => {
    let okpass = bcrypt.compareSync(req.body.pass, user.password);
    if (user !== null && okpass) {
      req.session.login = user;
      req.session.login.password = 'blog';
      res.redirect('/');
    } else {
      res.render('users/login', {
        title: 'ログイン',
        content: '名前かパスワードに問題があります。再度入力してください。',
        csrfToken: req.csrfToken()
        });
      }
  }).catch(err => {
    res.render('users/login', {
      title: 'ログイン',
      content: '名前かパスワードに問題があります。再度入力してください。',
      csrfToken: req.csrfToken()
      });
  })
});

// ログアウトページの表示
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

module.exports = router;