const express = require("express");


const app = express();
const port = 3000;



app.set('views','views');

app.set("view engine", "ejs");

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