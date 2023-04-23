const express = require("express");
const session = require("express-session");
const mySQLstore = require("express-mysql-session")(session);
const dbconfig = require("./config/dbconfig.json")//데이터베이스 정보
const app = express();
const port = 3000;
 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//뷰파일 설정
app.set('views','views');
//뷰 템플릿 엔진 설정
app.set("view engine", "ejs");
 


app.use(express.static('public')); //public 디렉토리를 정적 파일 제공을 위한 디렉토리로 설정
//세션 미들웨어
app.use(session({ 
  secret : '!@#$%^&*',
  store : new mySQLstore(dbconfig),
  resave : false,
  saveUninitialized : false,
}));
//로그인 후에 이용가능 미들웨어
const requireLogin = (req, res, next) => {
  if (!req.session.user) {
    if (req.path === '/login'|| req.path === '/signin' ) {
      next();
    } else {
      res.redirect('/login');
    }
  } else { 
    res.locals.logined = true;
    next();
  } 
}; 

// 로그인 후 로그인, 회원가입 클릭시 이용 가능한 미들웨어
const norequireLogin = (req, res, next) => {
  if (req.session.user && (req.path === '/login' || req.path === '/signin')) { 
    res.redirect('/');
  } else {
    next(); 
  } 
};

app.use(requireLogin);
app.use(norequireLogin);

app.use("/",require("./routes/home"))
  


// 전체게시물,게시물검색
app.use("/board",require("./routes/board"))

//게시물
app.use("/post",require("./routes/post"))

//게시판 댓글 
app.use("/comment",require("./routes/comment"))

//게시판 대댓글 생성
app.use("/reply",require("./routes/reply"))

//좋아요 클릭시 작동
app.use("/likes",require("./routes/likes"))

//로그인
app.use('/login', require("./routes/login"));

//회원가입
app.use('/signin', require("./routes/signin"));

//마이페이지
app.use('/mypage', require("./routes/mypage"));

//로그아웃
app.use('/logout', require("./routes/logout"));
  


app.use('/ranking', require("./routes/ranking"));


  

app.listen(port, () => {
console.log(`서버 실행 ${port}port`)
})