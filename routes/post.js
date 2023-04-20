const express = require('express');
const router = express.Router();
const connection = require('../db');
const multer = require('multer'); 
const path = require('path');
const postController = require('../controllers/postController')
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
 
router.get("/write",postController.getWritePost);         

//게시판 글작성
router.post('/write', express.json(), upload.array('images[]'),postController.postWritePost );

  //글 번호로 GET요청을 받았을 때 해당 번호에 맞는 글의 정보만을 보내는 코드
  router.get('/read/:id', postController.readPost);
  
  //글 수정 화면
  router.get('/update/:id',upload.array('images'), postController.getUpdatePost);
  
  router.post('/update/:id', express.json(), postController.postUpdatePost)
  
  //게시판 글삭제
  router.post('/delete/:id', postController.postdeletePost);

  module.exports=router;