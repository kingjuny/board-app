const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController')

router.post('/:id',likeController.updateLike);

module.exports=router;