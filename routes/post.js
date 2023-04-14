const express = require('express');
const router = express.Router();
const connection = require('../db');
const multer = require('multer'); 
const path = require('path');
// multer 미들웨어 설정
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images'); // 이미지 파일 저장 경로 설정
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname); // 파일 확장자 추출
        cb(null, `${Date.now()}${ext}`); // 파일 이름 설정 (현재 시간 + 확장자)
    }
  });
  const upload = multer({ storage: storage });
 
router.get("/write",(req,res) => {
  
    console.log(req.session.id)
    console.log(req.session.user)
    res.render('pages/writeboard');
    
  });         
  //게시판 글작성
  router.post('/write', express.json(), upload.array('images[]'), (req, res) => {
    const sql = 'INSERT INTO board (title, writer, content, image_path) VALUES (?, ?, ?, ?);';
    let images = null;
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => `/images/${file.filename}`);
    }  
    const params = [req.body.title, req.session.user, req.body.content, JSON.stringify(images)];
    
    connection.query(sql, params, (err, rows, fields) => {
      if (err) throw err;
      else {   
        console.log(rows.insertId, "번 게시글 등록");
        res.redirect(`/post/read/${rows.insertId}`)
      } 
    }) 
  });
  //글 번호로 GET요청을 받았을 때 해당 번호에 맞는 글의 정보만을 보내는 코드
  router.get('/read/:id', (req, res, next) => { 
    connection.query('SELECT b.*, u.nickname, u.profile_image_url FROM board b INNER JOIN users u ON b.writer = u.id;', (err, rows) => {
        if (err) throw err;
        const article = rows.find(art => art.idx === parseInt(req.params.id));
        if(!article) {
        return res.status(404).send('ID was not found.');
        }    
        // 조회수 증가
        connection.query('UPDATE board SET view_cnt = view_cnt + 1 WHERE idx = ?', [article.idx], (err, result) => {
            if (err) throw err;
            console.log('views updated for article with id: ', article.idx);
        });
        //댓글 조회
        connection.query('SELECT b.*, u.nickname, u.profile_image_url FROM comment b INNER JOIN users u ON b.writer = u.id WHERE board_id = ? ORDER BY created_at DESC;', [req.params.id], (err, comments) => {
          if (err) throw err;
        
          connection.query('SELECT r.*, u.nickname, u.profile_image_url FROM reply r INNER JOIN users u ON r.writer = u.id INNER JOIN comment c ON r.comment_id = c.id WHERE c.board_id = ? ORDER BY r.created_at ASC;', [req.params.id], (err, replies) => {
            if (err) throw err;
            
            res.render('pages/readBoard', { session: req.session, article: article, comment: comments, reply: replies });
          });
        });
        
  
        
    })
  })
  //글 수정 화면
  router.get('/update/:id',upload.array('images'), (req, res, next) => {
    connection.query('SELECT * from board', (err, rows) => {
      if (err) throw err;
      const article = rows.find(art => art.idx === parseInt(req.params.id));
      if(!article) {
      return res.status(404).send('ID was not found.');
      } 
      else if(req.session.user!=article.writer){
          res.redirect("/search_board"); 
      }else{
          res.render('pages/updateBoard',{article : article});
      }
    })
  })
  
  router.post('/update/:id', express.json(), (req, res, next) => {
    connection.query('SELECT * from board', (err, rows, fildes) => { 
      if (err) throw err;
      const article = rows.find(art => art.idx === parseInt(req.params.id));
      if(!article) {
        return res.status(404).send('ID was not found.');
      } 
      console.log(req.body)
      const sql = 'UPDATE board SET title = ?, writer = ?, content = ? WHERE idx = ?';
      const params = [req.body.title, req.session.user, req.body.content, req.params.id];
      console.log(params)
      connection.query(sql, params, (err, rows, fileds) => {
        if (err) throw err;
        console.log(rows);
      })
      // 데이터를 URL 쿼리 문자열로 전달
      res.redirect(`/post/read/${req.params.id}`) 
    })
  })
  
  //게시판 글삭제
  router.post('/delete/:id', (req, res, next) => {
    connection.query('DELETE FROM board WHERE idx = ?', [req.params.id], (err, rows, fileds) => {
      if (err) throw err;
      res.send('게시글이 삭제되었습니다.');
    });
  });
  module.exports=router;