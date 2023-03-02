const express = require("express");
const mysql = require("mysql");

const crypto = require("crypto");
const dbconfig = require("./config/dbconfig.json")//데이터베이스 정보
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//뷰파일 설정
app.set('views','views');
//뷰 템플릿 엔진 설정
app.set("view engine", "ejs");

// DB 커넥션 생성
const connection = mysql.createConnection({
  connectionLimit: 10,
  host: dbconfig.host,
  user: dbconfig.user,
  password: dbconfig.password,
  database: dbconfig.database,
  debug:false
});
// DB 접속
connection.connect();

app.get("/", (req, res) => {
  res.render("pages/home")
})
app.get("/search_board", (req, res) => {
  res.render("pages/search_board")
})
app.get("/login", (req, res) => {
  res.render("pages/login")
})
app.post("/login",(req,res) => {
  const loginid =req.body.loginEmail;
  const sql ="SELECT * FROM users WHERE id=? ;"
  connection.query(sql,[loginid],(err,results)=>{
    if(err) throw err
    //로그인 아이디가 틀렸을때
    if(!results[0]){
      console.log("아이디틀림");
      res.send("<script>alert('아이디를 확인하세요.'); window.location.replace('/login');</script>");
    }
    else{

    }
  })

})

app.get("/signin", (req, res) => {
  res.render("pages/signin")
})

app.post("/signin",(req,res)=>{

  const salt = crypto.randomBytes(32).toString('base64')// 솔트 생성
  const hashedPw = crypto.pbkdf2Sync(req.body.password, salt, 1, 32, 'sha512').toString('base64')
  const param = [req.body.email,req.body.name,req.body.age,hashedPw,salt]
  // 같은 아이디가 있는지확인
  connection.query("SELECT * FROM `nodeapp`.`users` WHERE `id` = ? ;",[req.body.email],(err, rows) => {
    if (err) {
      console.log(err);
    } 
    else {
      if (rows.length > 0) {
        res.send("<script>alert(`이미 등록된 이메일입니다.`); window.location.replace('/signin');</script>");
      } 
      else{
        connection.query('INSERT INTO `nodeapp`.`users` (`id`, `name`, `age`, `password`, `salt`) VALUES (?,?,?,?,?)',param,(err,row) =>{
          if(err) 
              console.log(err);
          else{
            console.log(`${req.body.name} 회원가입 성공`)
            res.send("<script>alert(`회원가입을 축하합니다.`);  window.location.replace('/login')</script>")
          }   
        });
      }
    }
  }); 
});
app.get("/mypage", (req, res) => {
    res.render("pages/mypage")
})
  
app.get("/stock_news", (req, res) => {
res.render("pages/stock_news")
})

app.get("/ranking", (req, res) => {
res.render("pages/ranking")
})

app.listen(port, () => {
console.log(`서버 실행 ${port}port`)
})