const express = require('express');
const router = express.Router();

router.get("/",(req,res)=>{
    req.session.destroy(function(err){
        res.redirect('/login')
    })
  })

module.exports=router;