const express = require('express');
const router = express.Router();
const secessionController = require("../controllers/secessionController")

router.post("/", express.json(),secessionController.secession)

module.exports=router;