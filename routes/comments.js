'use strict';
var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Blog = require('../models/blog');
var Comment = require('../models/comment');

router.post('/:blogId/users/:userId/comments/new', (req, res, next) => {
  const updatedAt = new Date();
  Comment.create({
    comment: req.body.comment,
    blogId: req.params.blogId,
    userId: req.params.userId,
    updatedAt: updatedAt
  }).then((comment) => {
    res.redirect(`/blogs/${comment.blogId}`);
  });
});

function myComment(req, comment) {
  return comment && parseInt(req.session.login.userId) === parseInt(comment.userId);
}

router.post('/:blogId/users/:userId/comments/:commentId', (req, res, next) => {
  if (parseInt(req.query.delete) === 1) {
    Comment.findByPk(req.params.commentId).then((comment) => {
      if (myComment(req, comment)) {
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