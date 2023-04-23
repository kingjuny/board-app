const express = require('express');
const router = express.Router();
const rankingController =require('../controllers/rankingController')

router.get("/",rankingController.getRankingPage);

router.post("/daybest",rankingController.getDayBest);

router.post("/weekbest",rankingController.getWeekBest);

router.post("/monthbest",rankingController.getMonthBest);

module.exports=router;