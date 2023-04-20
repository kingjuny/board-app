// controllers/loginController.js
const userModel = require('../models/user');

exports.getLogin = (req, res) => {
res.render("pages/login");
};

exports.postLogin = (req, res) => {
const id = req.body.loginEmail;
const password = req.body.loginPassword;

userModel.login(id, password, (err, user) => {
if (err) {
if (err === "Incorrect id") {
res.send("<script>alert('아이디를 확인하세요.'); window.location.replace('/login');</script>");
} else {
res.send("<script>alert('비밀번호가 틀렸습니다.'); window.location.replace('/login');</script>");
}
} else {
console.log("로그인 성공");
req.session.nickname = req.body.nickname;
req.session.user = id;
res.redirect('/');
}
});
};

module.exports = exports;