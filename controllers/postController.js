const postModel = require('../models/post');

exports.getWritePost = (req, res) => {
    res.render('pages/writeboard');
};


exports.postWritePost = (req, res) => {
 
  let images = null;
  if (req.files && req.files.length > 0) {
    images = req.files.map(file => `/images/${file.filename}`);
  }
  const params = [req.body.title, req.session.user, req.body.content, JSON.stringify(images)];
  postModel.insertPost(params,(err, rows) => {
    if (err) throw err;
    else {
      console.log(rows.insertId, "번 게시글 등록");
      res.redirect(`/post/read/${rows.insertId}`);
    }
  });
};

exports.readPost = (req, res, next) => {
    const id = parseInt(req.params.id);
    postModel.getPost(id, (err, article) => {
      if (err) {
        return next(err);
      }
      if (!article) {
        return res.status(404).send('ID was not found.');
      }
      postModel.updateViewCnt(id, (err) => {
        if (err) {
          return next(err);
        }
        postModel.getComments(id, (err, comments) => {
          if (err) {
            return next(err);
          }
          postModel.getReplies(id, (err, replies) => {
            if (err) {
              return next(err);
            }
            res.render('pages/readBoard', { session: req.session, article, comment: comments, reply: replies });
          });
        });
      });
    });
  };
//글 수정 화면
exports.getUpdatePost = (req, res) => {
    postModel.getAllPost((err, rows) => {
      if (err) throw err;
      const article = rows.find(art => art.idx === parseInt(req.params.id));
      if(!article) {
      return res.status(404).send('ID was not found.');
      } 
      else if(req.session.user!=article.writer){
          res.redirect("/board"); 
      }else{
          res.render('pages/updateBoard',{article : article});
      }
    })
  }

  exports.postUpdatePost = (req, res) => {
    postModel.getAllPost((err, rows) => {
      if (err) throw err;
      const article = rows.find(art => art.idx === parseInt(req.params.id));
      if(!article) {
        return res.status(404).send('ID was not found.');
      } 
      console.log(req.body)
      const params = [req.body.title, req.session.user, req.body.content, req.params.id];
      console.log(params)
      postModel.updatePost(params,(err, row) => {
        if (err) throw err;
        console.log(row);
      })
      // 데이터를 URL 쿼리 문자열로 전달
      res.redirect(`/post/read/${req.params.id}`) 
    })
  }

  exports.postdeletePost = (req, res) => {
    postid=[req.params.id]
    postModel.deletePost(postid,(err, row) => {
        if (err) throw err;
        res.send('게시글이 삭제되었습니다.');
    });
  };

  
