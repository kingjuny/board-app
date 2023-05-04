const userModel = require('../models/user');
//
exports.secession=(req, res) => {
    const userid = req.session.user
    const userpw = req.body.password
    
    userModel.login(userid,userpw,(err)=>{
        if (err) {
            if (err === "Incorrect password") {
                res.send("<script>alert('비밀번호가 틀렸습니다.'); window.location.replace('/mypage');</script>");
            } else {
                throw err;
            }
        }
        else{
            
            userModel.dleteUser(userid,(err, rows) => {
                if (err) throw err;
                else{
                    req.session.destroy(function(err){
                        res.redirect('/login')
                    })
                }
            })
        }
    })
       
  }