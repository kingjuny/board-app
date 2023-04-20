const express = require('express');
const likesModel = require('../models/like');
const postModel = require('../models/post');

exports.updateLike = (req, res) => {
  const articleId = req.params.id;
  const userId = req.session.user;
  console.log('articleId:', articleId, 'userId:', userId);
  likesModel.checkDuplicate(articleId, userId, (err, rows) => {
    if (err) {
      console.error(err);
      return res.sendStatus(500); // Internal server error
    }
    if (rows.length > 0) {
      // 이미 좋아요를 누른 경우
      likesModel.deleteLike(articleId, userId, (err, rows) => {
        if (err) {
          console.error(err);
        }
      });
    } else {
      // 좋아요 추가
      likesModel.addLike(articleId, userId, (err, rows, fields) => {
        if (err) {
          console.error(err);
        }
      });
    }
    postModel.getPost(articleId, (err, rows) => {
      if (err) {
        console.error(err);
      } else {
        res.send(rows);
      }
    });
  });
};

