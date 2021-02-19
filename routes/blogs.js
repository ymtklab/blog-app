'use strict';
var express = require('express');
var router = express.Router();
const moment = require('moment-timezone');
var check = require('./check'); 
var Blog = require('../models/blog');
var User = require('../models/user');
var Comment = require('../models/comment');

// 新規投稿
router.get('/new', (req, res, next) => {
  if (check(req, res)){ return };
  res.render('new', {
    title: 'ブログ作成',
    login: req.session.login
  });
});

router.post('/', (req, res, next) => {
  const updatedAt = new Date();
  Blog.create({
    blogTitle: req.body.blogTitle,
    blogText: req.body.blogText,
    createdBy: req.session.login.userId,
    updatedAt: updatedAt
  }).then((blog) => {
    res.redirect('/');
  });
});

// ブログの取得・表示
router.get('/:blogId', (req, res, next) => {
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
        comments: comments
      });
    });
  });
});

function isMine(req, blog) {
  return blog && parseInt(req.session.login.userId) === parseInt(blog.createdBy);
}

// ブログの編集
router.get('/:blogId/edit', (req, res, next) => {
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
        blog: blog
      });
    } else {
      const err = new Error('指定されたブログがない、または、編集する権限がありません');
      err.status = 404;
      next(err);
    }
  });
});

router.post('/:blogId', (req, res, next) => {
  Blog.findOne({
    where: {
      blogId: req.params.blogId
    }
  }).then((blog) => {
    if (blog && isMine(req, blog)) {
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