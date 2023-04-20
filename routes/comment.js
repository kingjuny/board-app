const express = require('express');
const router = express.Router();
const connection = require('../db');
const commentController = require('../controllers/commentController')

//게시판 댓글 생성
router.post("/post/:id", commentController.writeComment);
  
  //게시판 댓글 수정,삭제
  router.post("/:id/:action", commentController.commentAction);    
  module.exports=router;