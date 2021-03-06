'use strict';
var express = require('express');
var router = express.Router();
const moment = require('moment-timezone');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });
var check = require('./check'); 
var Blog = require('../models/blog');
var User = require('../models/user');
var Comment = require('../models/comment');

// 新規投稿ページの表示
router.get('/new', csrfProtection, (req, res, next) => {
  if (check(req, res)){ return };
  res.render('new', {
    title: 'ブログ作成',
    login: req.session.login,
    csrfToken: req.csrfToken(),
    message: '',
    text: ''
  });
});

// 新規投稿の処理
router.post('/', csrfProtection, (req, res, next) => {
  const updatedAt = new Date();
  Blog.create({
    blogTitle: req.body.blogTitle || '(タイトル未入力)',
    blogText: req.body.blogText,
    createdBy: req.session.login.userId,
    updatedAt: updatedAt
  }).then((blog) => {
    res.redirect('/');
  }).catch(err => {
    res.render('new', {
      title: 'ブログ作成',
      login: req.session.login,
      csrfToken: req.csrfToken(),
      message: 'タイトルは255文字までにしてください',
      text: req.body.blogText
    });
  });
});

// 各ブログの詳細表示
router.get('/:blogId', csrfProtection, (req, res, next) => {
  if (check(req, res)){ return };
  const login = req.session.login;
  Blog.findOne({
    include: [
      {
        model: User,
        attributes: ['userId', 'username']
      }],
    where: {
      blogId: req.params.blogId
    }
  }).then((blog) => {
    Comment.findAll({
      include: [
        {
          model: User,
          attributes: ['userId','username']
        }],
      where: {
        blogId: blog.blogId
      },
      order: [['updatedAt', 'DESC']]
    }).then((comments) => {
      comments.forEach((comment) => {
        comment.formattedCreatedAt = moment(comment.updatedAt).tz('Asia/Tokyo').format('YYYY年MM月DD日 HH時mm分ss秒');
      });
      res.render('blog', {
        login: login,
        blog: blog,
        comments: comments,
        csrfToken: req.csrfToken()
      });
    });
  });
});

// ログインユーザーとブログ作者が同一かチェック
function isMine(req, blog) {
  return blog && parseInt(req.session.login.userId) === parseInt(blog.createdBy);
};

// ログインユーザーが管理者かチェック
function isAdmin(req, blog) {
  return blog && parseInt(req.session.login.userId) === 1;
};

// ブログの編集ページを表示
router.get('/:blogId/edit', csrfProtection, (req, res, next) => {
  if (check(req, res)){ return };
  const login = req.session.login;
  Blog.findOne({
    where: {
      blogId: req.params.blogId
    }
  }).then((blog) => {
    if (isMine(req, blog)) {
      res.render('edit', {
        login: login,
        blog: blog,
        csrfToken: req.csrfToken()
      });
    } else {
      const err = new Error('指定されたブログがない、または、編集する権限がありません');
      err.status = 404;
      next(err);
    }
  });
});

// ブログの編集・削除処理
router.post('/:blogId', csrfProtection, (req, res, next) => {
  Blog.findOne({
    where: {
      blogId: req.params.blogId
    }
  }).then((blog) => {
    if (blog && isMine(req, blog) || isAdmin(req, blog)) {
      if (parseInt(req.query.edit) === 1) {
        const updatedAt = new Date();
        blog.update({
          blogId: blog.blogId,
          blogTitle: req.body.blogTitle,
          blogText: req.body.blogText,
          createdBy: req.session.login.userId,
          updatedAt: updatedAt
        }).then((blog) => {
          res.redirect(`/blogs/${blog.blogId}`);
        }).catch(err => {
          res.render('error', {
            message: 'タイトルは255文字までにしてください',
            returnurl: req.params.blogId
          });
        });
      } else if (parseInt(req.query.delete) === 1) {
        Comment.findAll({
          where: {
            blogId: blog.blogId
          }
        }).then((comments) => {
          comments.map((c) => c.destroy())
        }).then(() => {
          blog.destroy().then(() => {
            res.redirect('/');
          });
        })
      } else {
        const err = new Error('不正なリクエストです');
        err.status = 400;
        next(err);
      }
    } else {
      const err = new Error('指定されたブログがない、または編集する権限がありません');
      err.status = 404;
      next(err);
    }
  });
});

module.exports = router;