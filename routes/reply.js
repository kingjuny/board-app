const express = require('express');
const router = express.Router();
const connection = require('../db');

//게시판 대댓글 생성
router.post("/comment/:id", (req, res, next) => { 
    console.log(`${req.params.id}번 게시글`)
    connection.query(
      "INSERT INTO reply (writer, content, comment_id) VALUES (?, ?, ?);",
      [req.session.user, req.body.replyContent, req.params.id],
      (err, rows, fileds) => {
        if (err) throw err;
        else {  
          console.log(`${req.params.id}번 게시글 ${rows.insertId}번 댓글 등록`);
          //댓글 조회
          connection.query('SELECT b.*, u.nickname, u.profile_image_url FROM comment b INNER JOIN users u ON b.writer = u.id WHERE board_id = ? ORDER BY created_at DESC;', [req.body.boardId], (err, results) => {
            if (err) throw err;
            connection.query('SELECT r.*, u.nickname, u.profile_image_url FROM reply r INNER JOIN users u ON r.writer = u.id INNER JOIN comment c ON r.comment_id = c.id WHERE c.board_id = ? ORDER BY r.created_at ASC;', [req.body.boardId], (err, replies) => {
              if (err) throw err;
              
              res.send({ session : req.session ,comment : results, reply: replies });
            });
          });
        }
      }
    );
  });
  
  
  //게시판 대댓글 수정,삭제
  router.post("/:id/:action", (req, res, next) => {
    if(req.params.action==="editreply"){ 
      console.log(req.body.boardId)
      const updatedContent = req.body.content;
      connection.query("UPDATE reply SET content = ? WHERE id = ?;",[updatedContent, req.params.id],(err, rows, fileds) => { 
          if (err) throw err;
          else {  
            console.log(`${req.params.id}번 대댓글 수정`);
            //댓글,대댓글 조회
            connection.query('SELECT b.*, u.nickname, u.profile_image_url FROM comment b INNER JOIN users u ON b.writer = u.id WHERE board_id = ? ORDER BY created_at DESC;', [req.body.boardId], (err, results) => {
              if (err) throw err;
              connection.query('SELECT r.*, u.nickname, u.profile_image_url FROM reply r INNER JOIN users u ON r.writer = u.id INNER JOIN comment c ON r.comment_id = c.id WHERE c.board_id = ? ORDER BY r.created_at ASC;', [req.body.boardId], (err, replies) => {
                if (err) throw err;
                
                res.send({ session : req.session ,comment : results, reply: replies });
              });
            });
           
          }
        });
    }
    else{
      console.log(req.params.action)
      connection.query(
        "DELETE FROM reply WHERE id = ?;",
        [req.params.id],
        (err, rows, fileds) => { 
          if (err) throw err;
          else {  
            console.log(`${req.params.id}번 대댓글 삭제`);
            
            //댓글,대댓글 조회
            connection.query('SELECT b.*, u.nickname, u.profile_image_url FROM comment b INNER JOIN users u ON b.writer = u.id WHERE board_id = ? ORDER BY created_at DESC;', [req.body.boardId], (err, results) => {
              if (err) throw err;
              connection.query('SELECT r.*, u.nickname, u.profile_image_url FROM reply r INNER JOIN users u ON r.writer = u.id INNER JOIN comment c ON r.comment_id = c.id WHERE c.board_id = ? ORDER BY r.created_at ASC;', [req.body.boardId], (err, replies) => {
                if (err) throw err;
                
                res.send({ session : req.session ,comment : results, reply: replies });
              });
              
            });
          }
        }
      ); 
    }
  });    

module.exports=router;