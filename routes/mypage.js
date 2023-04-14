const express = require('express');
const router = express.Router();
const multer = require('multer'); 
const path = require('path');
const connection = require('../db');

// 프로필 변경 multer 미들웨어 설정
const profileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/profile'); // 프로필 이미지 파일 저장 경로 설정
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname); // 파일 확장자 추출
        cb(null, `${Date.now()}${ext}`); // 파일 이름 설정 (현재 시간 + 확장자)
    }
  });
  const uploadProfileImage = multer({ storage: profileStorage });

router.get("/", (req, res) => {
    connection.query('SELECT * FROM users;', (err, rows) => {
      console.log(req.session.user)
      if (err) throw err;
      const article = rows.find(art => art.id === req.session.user);
      if(!article) {
      return res.status(404).send('ID was not found.');
      }    
      connection.query('SELECT * FROM board WHERE writer = ?;',[req.session.user], function(error, results, fields) {
        if (error) throw error;
        connection.query('SELECT likes.board_id, likes.user_id, likes.created_at, board.idx, board.title, board.likes_cnt, users.nickname FROM likes INNER JOIN board ON likes.board_id = board.idx INNER JOIN users ON board.writer = users.id WHERE likes.user_id =?;',
          [req.session.user], function(error, likes, fields) {
          if (error) throw error;
          else{
            res.render('pages/mypage',{ session : req.session , article : article , results: results , likes: likes});
          }
        });
      });
      
    })
  })
  //프로필 이미지 변경
  router.post('/profile', uploadProfileImage.single('profile-image'), (req, res) => {
    const file = req.file; // 업로드한 파일 정보
    const userId = req.session.user; // 사용자 아이디
    const previousProfileImagePath = req.body.profile_image_url; // 이전 프로필 이미지 경로
  
    const profileImagePath = file ? `/profile/${file.filename}` : null; // 프로필 사진 파일 경로
   // 프로필 사진 파일 경로
    console.log(previousProfileImagePath)
    // MySQL 데이터베이스에서 사용자 정보 업데이트
    const sql = 'UPDATE users SET profile_image_url = ? WHERE id = ?';
    connection.query(sql, [profileImagePath, userId], (error, results, fields) => {
      if (error) throw error;
      
      // 업데이트 성공 시
      res.redirect('/mypage');
    });
  });
module.exports=router;