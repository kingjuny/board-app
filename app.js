const express = require("express");
const mysql = require("mysql");
const session = require("express-session");
const mySQLstore = require("express-mysql-session")(session);
const crypto = require("crypto");
const dbconfig = require("./config/dbconfig.json")//데이터베이스 정보
//이미지 업로드
const multer = require('multer');
const path = require('path');
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
// multer 미들웨어 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'public/images'); // 이미지 파일 저장 경로 설정
  },
  filename: function (req, file, cb) {
      const ext = path.extname(file.originalname); // 파일 확장자 추출
      cb(null, `${Date.now()}${ext}`); // 파일 이름 설정 (현재 시간 + 확장자)
  }
});
const upload = multer({ storage: storage });

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
  connection.query('SELECT b.*, u.nickname FROM board b INNER JOIN users u ON b.writer = u.id', function(error, results, fields) {
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
app.post('/board/write', express.json(), upload.array('images[]'), (req, res) => {
  const sql = 'INSERT INTO board (title, writer, content, image_path) VALUES (?, ?, ?, ?);';
  let images = null;
  if (req.files && req.files.length > 0) {
    images = req.files.map(file => `public/images/${file.filename}`);
  }
  const params = [req.body.title, req.session.user, req.body.content, JSON.stringify(images)];
  
  connection.query(sql, params, (err, rows, fields) => {
    if (err) throw err;
    else {
      console.log(rows.insertId, "번 게시글 등록");
      res.redirect(`/board/read/${rows.insertId}`)
    } 
  })
});



//글 번호로 GET요청을 받았을 때 해당 번호에 맞는 글의 정보만을 보내는 코드
app.get('/board/read/:id',requireLogin, (req, res, next) => {
  connection.query('SELECT b.*, u.nickname FROM board b INNER JOIN users u ON b.writer = u.id', (err, rows) => {
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
//글 수정 화면
app.get('/board/update/:id',upload.array('images'), (req, res, next) => {
  connection.query('SELECT * from board', (err, rows) => {
    if (err) throw err;
    const article = rows.find(art => art.idx === parseInt(req.params.id));
    if(!article) {
    return res.status(404).send('ID was not found.');
    } 
    else if(req.session.user!=article.writer){
        res.redirect("/search_board"); 
    }else{
        res.render('pages/updateBoard',{article : article});
    }
  })
})

app.post('/board/update/:id', express.json(), (req, res, next) => {
  connection.query('SELECT * from board', (err, rows, fildes) => { 
    if (err) throw err;
    const article = rows.find(art => art.idx === parseInt(req.params.id));
    if(!article) {
      return res.status(404).send('ID was not found.');
    } 
    console.log(req.body)
    const sql = 'UPDATE board SET title = ?, writer = ?, content = ? WHERE idx = ?';
    const params = [req.body.title, req.session.user, req.body.content, req.params.id];
    console.log(params)
    connection.query(sql, params, (err, rows, fileds) => {
      if (err) throw err;
      console.log(rows);
    })
    // 데이터를 URL 쿼리 문자열로 전달
    res.redirect(`/board/read/${req.params.id}`) 
  })
})

//게시판 글삭제
app.post('/board/delete/:id', (req, res, next) => {
  connection.query('DELETE FROM board WHERE idx = ?', [req.params.id], (err, rows, fileds) => {
    if (err) throw err;
    res.send('게시글이 삭제되었습니다.');
  });
});

app.get("/login",norequireLogin, (req, res) => {
  res.render("pages/login")
})


//좋아요 클릭시 작동
app.post('/likes/:id', (req, res) => {  
  const articleId = req.params.id;
  const userId = req.session.user;
  console.log('articleId:', articleId, 'userId:', userId);
  // 중복 체크
  connection.query('SELECT * FROM likes WHERE board_id = ? AND user_id = ?', [articleId, userId], (err, rows) => {
    if (err) {
      console.error(err);
      return res.sendStatus(500); // Internal server error
    }
    if (rows.length > 0) {
      // 이미 좋아요를 누른 경우
       // 좋아요 삭제
      connection.query('DELETE FROM likes WHERE board_id = ? AND user_id = ?', [articleId, userId], (err, rows) => {
        if (err) {
          console.error(err); 
        }
      });
    } else {  
      // 좋아요 추가
      connection.query('INSERT INTO likes (board_id, user_id) VALUES (?, ?);', [articleId, userId], (err, rows,fields) => {
        if (err) {
          console.error(err); 
        }
      });
    }//좋아요 개수 반환
    connection.query('SELECT * FROM board WHERE idx = ?', [articleId], (err, rows) => {
      if (err) {
        console.error(err);
      } else {
        const article = rows[0];
        res.send(article);
      }
    });
  });
});




 

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
            req.session.nickname = req.body.nickname;
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
  const param = [req.body.email,req.body.name,req.body.nickname,req.body.age,hashedPw,salt]
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
        connection.query('INSERT INTO `nodeapp`.`users` (`id`, `name`, `nickname`, `age`, `password`, `salt`) VALUES (?,?,?,?,?,?)',param,(err,row) =>{
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
  connection.query('SELECT * FROM users;', (err, rows) => {
    console.log(req.session.user)
    if (err) throw err;
    const article = rows.find(art => art.id === req.session.user);
    if(!article) {
    return res.status(404).send('ID was not found.');
    }    
    connection.query('SELECT * FROM board WHERE writer = ?;',[req.session.user], function(error, results, fields) {
      if (error) throw error;
      connection.query('SELECT likes.board_id, likes.user_id, likes.created_at, board.idx, board.title, board.likes_cnt, users.nickname FROM likes INNER JOIN board ON likes.board_id = board.idx INNER JOIN users ON board.writer = users.id WHERE likes.user_id =?;',
        [req.session.user], function(error, likes, fields) {
        if (error) throw error;
        else{
          res.render('pages/mypage',{ session : req.session , article : article , results: results , likes: likes});
        }
      });
    });
    
  })
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