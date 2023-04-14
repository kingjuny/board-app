// routes/.js
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const connection = require('../db');

router.get("/", (req, res) => {
  res.render("pages/login")
});

router.post("/", (req, res) => {
  const loginid =req.body.loginEmail;
  const loginpassword =req.body.loginPassword;
  const sql ="SELECT * FROM users WHERE id=? ;"
  connection.query(sql,[loginid],(err,results)=>{
    if(err) throw err
    //로그인 아이디가 틀렸을때
    if(!results[0]){
      console.log("아이디틀림");
      res.send("<script>alert('아이디를 확인하세요.'); window.location.replace('/login');</script>");
    }
    else{
      const user = results[0];
      crypto.pbkdf2(loginpassword,user.salt, 1, 32, 'sha512',(err,derivedkey)=>{
        if(err) console.log(err);
        if(derivedkey.toString('base64')===user.password){
            console.log(req.session.user)
            console.log("성공");
            req.session.nickname = req.body.nickname;
            req.session.user = loginid;
            res.redirect('/');
        }
        else{
            console.log("pw틀림");
            res.send("<script>alert('비밀번호가 틀렸습니다.'); window.location.replace('/login');</script>");
        }
      }); 
    } 
  })
});

module.exports = router;
