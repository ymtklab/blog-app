'use strict';
var express = require('express');
var router = express.Router();
var Comment = require('../models/comment');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

// コメントの投稿処理
router.post('/:blogId/users/:userId/comments/new', csrfProtection, (req, res, next) => {
  const updatedAt = new Date();
  Comment.create({
    comment: req.body.comment,
    blogId: req.params.blogId,
    userId: req.params.userId,
    updatedAt: updatedAt
  }).then((comment) => {
    res.redirect(`/blogs/${comment.blogId}`);
  }).catch(err => {
    res.render('error', {
      message: 'コメントは255文字までにしてください',
      returnurl: req.params.blogId
    });
  });
});

// ログインユーザーとコメントの投稿者が同一かチェック
function myComment(req, comment) {
  return comment && parseInt(req.session.login.userId) === parseInt(comment.userId);
};

// コメントを削除するユーザーが管理者かチェック
function isAdmin(req, comment) {
  return comment && parseInt(req.session.login.userId) === 1;
};

// コメントの削除処理
router.post('/:blogId/users/:userId/comments/:commentId', csrfProtection, (req, res, next) => {
  if (parseInt(req.query.delete) === 1) {
    Comment.findByPk(req.params.commentId).then((comment) => {
      if (myComment(req, comment) || isAdmin(req, comment)) {
        comment.destroy().then(() => {
          res.redirect(`/blogs/${req.params.blogId}`);
        });
      } else {
        const err = new Error('指定されたコメントがない、または編集する権限がありません');
        err.status = 404;
        next(err);
      }
    });
  } else {
    const err = new Error('不正なリクエストです');
    err.status = 400;
    next(err);
  }
});

module.exports = router;