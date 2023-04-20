const express = require('express');
const router = express.Router();
const replyController = require('../controllers/replyController')

//게시판 대댓글 생성
router.post("/comment/:id", replyController.writeReply);
  
  
  //게시판 대댓글 수정,삭제
  router.post("/:id/:action", replyController.replyAction);    

module.exports=router;