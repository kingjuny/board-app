
// controllers/userController.js
const userModel = require('../models/user');

exports.getSignup = (req, res) => {
    res.render('pages/signin');
};

exports.postSignup = (req, res) => {
    const userData = {
        email: req.body.email,
        name: req.body.name,
        nickname: req.body.nickname,
        age: req.body.age,
        password: req.body.password,
      };

     // 같은 이메일이 있는지 확인
    userModel.checkEmail(userData.email, (err, user) => {
        if (err) {
        console.log(err);
        res.send("<script>alert(`오류가 발생했습니다.`); window.location.replace('/signin');</script>");
        } else if (user) {
        res.send("<script>alert(`이미 등록된 이메일입니다.`); window.location.replace('/signin');</script>");
        } else {
        userModel.addUser(userData, (err, result) => {
            if (err) {
            console.log(err);
            res.send("<script>alert(`오류가 발생했습니다.`); window.location.replace('/signin');</script>");
            } else {
            console.log(`${userData.name} 회원가입 성공`);
            res.send("<script>alert(`회원가입을 축하합니다.`);  window.location.replace('/login')</script>");
            }
        });
        }
    });
};

module.exports = exports;
