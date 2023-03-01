const express = require("express");
const mysql = require("mysql");
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
app.get("/login", (req, res) => {
  res.render("pages/login")
})

app.get("/signin", (req, res) => {
  res.render("pages/signin")
})

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