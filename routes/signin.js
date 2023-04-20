// routes/signup.js

const express = require('express');
const router = express.Router();

const signinController =require('../controllers/signinController')

// 회원가입 페이지 렌더링
router.get('/', signinController.getSignup);

// 회원가입 요청 처리
router.post('/', signinController.postSignup);

module.exports = router;
