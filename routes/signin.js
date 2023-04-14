// routes/signup.js

const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const connection = require('../db');

// 회원가입 페이지 렌더링
router.get('/', (req, res) => {
  res.render('pages/signin');
});

// 회원가입 요청 처리
router.post('/', (req, res) => {
  const salt = crypto.randomBytes(32).toString('base64'); // 솔트 생성
  const hashedPw = crypto.pbkdf2Sync(req.body.password, salt, 1, 32, 'sha512').toString('base64');
  const param = [req.body.email,req.body.name,req.body.nickname,req.body.age,hashedPw,salt];
  
  // 같은 아이디가 있는지 확인
  connection.query("SELECT * FROM `nodeapp`.`users` WHERE `id` = ? ;",[req.body.email],(err, rows) => {
    if (err) {
      console.log(err);
    }    
    else {
      if (rows.length > 0) {
        res.send("<script>alert(`이미 등록된 이메일입니다.`); window.location.replace('/signup');</script>");
      } 
      else{
        connection.query('INSERT INTO `nodeapp`.`users` (`id`, `name`, `nickname`, `age`, `password`, `salt`) VALUES (?,?,?,?,?,?)',param,(err,row) =>{
          if(err) 
              console.log(err);
          else{
            console.log(`${req.body.name} 회원가입 성공`);
            res.send("<script>alert(`회원가입을 축하합니다.`);  window.location.replace('/login')</script>");
          }   
        });
      }
    }
  }); 
});

module.exports = router;
