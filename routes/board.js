const express = require('express');
const router = express.Router();
const boardController =require('../controllers/boardController')

//게시물 전체조회


router.get("/", boardController.getAllPosts);

router.get('/search', boardController.searchPost);
module.exports=router;