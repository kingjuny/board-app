const express = require('express');
const router = express.Router();
const multer = require('multer'); 
const path = require('path');
const connection = require('../db');
const mypageController =require('../controllers/mypageController')

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

router.get("/", mypageController.getMyPage);
  //프로필 이미지 변경
router.post('/profile', uploadProfileImage.single('profile-image'), mypageController.updateProfileImg);

module.exports=router;