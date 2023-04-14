const express = require('express');
const router = express.Router();
const connection = require('../db');

router.post('/:id', (req, res) => {  
    const articleId = req.params.id;
    const userId = req.session.user;
    console.log('articleId:', articleId, 'userId:', userId);
    // 중복 체크
    connection.query('SELECT * FROM likes WHERE board_id = ? AND user_id = ?', [articleId, userId], (err, rows) => {
      if (err) {
        console.error(err);
        return res.sendStatus(500); // Internal server error
      }
      if (rows.length > 0) {
        // 이미 좋아요를 누른 경우
         // 좋아요 삭제
        connection.query('DELETE FROM likes WHERE board_id = ? AND user_id = ?', [articleId, userId], (err, rows) => {
          if (err) {
            console.error(err); 
          }
        });
      } else {  
        // 좋아요 추가
        connection.query('INSERT INTO likes (board_id, user_id) VALUES (?, ?);', [articleId, userId], (err, rows,fields) => {
          if (err) {
            console.error(err); 
          }
        });
      }//좋아요 개수 반환
      connection.query('SELECT * FROM board WHERE idx = ?', [articleId], (err, rows) => {
        if (err) {
          console.error(err);
        } else {
          const article = rows[0];
          res.send(article);
        }
      });
    });
  });

module.exports=router;