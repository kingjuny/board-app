const express = require("express");
const mysql = require("mysql");
const session = require("express-session");
const mySQLstore = require("express-mysql-session")(session);
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
    res.redirect('/login');
  } else {
    res.locals.logined = true;
    next();
  } 
};
//로그인 후 로그인,회원가입 클릭시  이용가능 미들웨어
const norequireLogin = (req, res, next) => {
  if (req.session.user) {
    res.redirect('/');
  } else {
    next();
  } 
};
 
app.get("/",requireLogin, (req, res) => {
  
    res.render("pages/home") 
  });


app.get("/search_board",requireLogin, (req, res) => {
  connection.query('SELECT * FROM board', function(error, results, fields) {
    if (error) throw error;
    else{
      res.render("pages/search_board",{results: results})
    }
  })
})

app.get("/board/write",requireLogin,(req,res) => {
  
  console.log(req.session.id)
  console.log(req.session.user)
  res.render('pages/writeboard');
  
});
//게시판 글작성
app.post('/board/write', express.json(), (req, res) => {
  const sql = 'INSERT INTO board (title, writer, content) VALUES (?, ?, ?);';
  const params = [req.body.title,req.session.user, req.body.content];
  
  connection.query(sql, params, (err, rows, fileds) => {
    if (err) throw err;
    else{
      console.log(rows.insertId,"번 게시글 등록");
      res.redirect(`/board/read/${rows.insertId}`)
    }
  })
}) 
//글 번호로 GET요청을 받았을 때 해당 번호에 맞는 글의 정보만을 보내는 코드
app.get('/board/read/:id',requireLogin, (req, res, next) => {
  connection.query('SELECT * from board', (err, rows) => {
      if (err) throw err;
      const article = rows.find(art => art.idx === parseInt(req.params.id));
      if(!article) {
      return res.status(404).send('ID was not found.');
      }    
      // 조회수 증가
      connection.query('UPDATE board SET view_cnt = view_cnt + 1 WHERE idx = ?', [article.idx], (err, result) => {
          if (err) throw err;
          console.log('views updated for article with id: ', article.idx);
      });
      res.render('pages/readBoard',{ session : req.session , article : article});
  })
})

app.get("/login",norequireLogin, (req, res) => {
  res.render("pages/login")
})

app.post("/login",(req,res) => {
  const loginid =req.body.loginEmail;
  const loginpassword =req.body.loginPassword;
  const sql ="SELECT * FROM users WHERE id=? ;"
  connection.query(sql,[loginid],(err,results)=>{
    if(err) throw err
    //로그인 아이디가 틀렸을때
    if(!results[0]){
      console.log("아이디틀림");
      res.send("<script>alert('아이디를 확인하세요.'); window.location.replace('/login');</script>");
    }
    else{
      const user = results[0];
      crypto.pbkdf2(loginpassword,user.salt, 1, 32, 'sha512',(err,derivedkey)=>{
        if(err) console.log(err);
        if(derivedkey.toString('base64')===user.password){
            console.log(req.session.user)
            console.log("성공");
            req.session.user = loginid;
            res.redirect('/');
        }
        else{
            console.log("pw틀림");
            res.send("<script>alert('비밀번호가 틀렸습니다.'); window.location.replace('/login');</script>");
        }
      }); 
    } 
  })
})

app.get("/signin",norequireLogin, (req, res) => {
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
app.get("/mypage",requireLogin, (req, res) => {
    res.render("pages/mypage")
})
  
app.get("/stock_news", (req, res) => {
res.render("pages/stock_news")
})

app.get("/ranking", (req, res) => {
res.render("pages/ranking")
})
app.get("/logout",(req,res)=>{
  req.session.destroy(function(err){
      res.redirect('/login')
  })
})

app.listen(port, () => {
console.log(`서버 실행 ${port}port`)
})