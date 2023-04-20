const replyModel = require('../models/reply')
const postModel = require('../models/post')

//게시판 대댓글 생성
exports.writeReply = (req, res) => { 
    console.log(`${req.params.id}번 게시글`)
    params = [req.session.user, req.body.replyContent, req.params.id]
    replyModel.insertReply(params,(err, rows) => {
        if (err) throw err;
        else {  
          console.log(`${req.params.id}번 게시글 ${rows.insertId}번 댓글 등록`);
          //댓글 조회
          postModel.getComments([req.body.boardId], (err, comments) => {  
            if (err) throw err;
                postModel.getReplies([req.body.boardId], (err, replies) => {  
                if (err) throw err;
                res.send({ session : req.session ,comment : comments, reply: replies });
            });
        });
        }
      }
    );
  };

  //게시판 대댓글 수정,삭제
  exports.replyAction = (req, res) => { 
    if(req.params.action==="editreply"){ 
      console.log(req.body.boardId)
      const params = [req.body.content, req.params.id];
      replyModel.updateReply(params,(err, rows) => {
          if (err) throw err;
          else {  
            console.log(`${req.params.id}번 대댓글 수정`);
            //댓글,대댓글 조회
            postModel.getComments([req.body.boardId], (err, comments) => {  
                if (err) throw err;
                    postModel.getReplies([req.body.boardId], (err, replies) => {  
                    if (err) throw err;
                    res.send({ session : req.session ,comment : comments, reply: replies });
                });
            });
           
          }
        });
    }
    else{
      console.log(req.params.action)
      replyModel.deleteReply([req.params.id],(err, rows) => {
          if (err) throw err;
          else {  
            console.log(`${req.params.id}번 대댓글 삭제`);
            
            //댓글,대댓글 조회
            postModel.getComments([req.body.boardId], (err, comments) => {  
                if (err) throw err;
                    postModel.getReplies([req.body.boardId], (err, replies) => {  
                    if (err) throw err;
                    res.send({ session : req.session ,comment : comments, reply: replies });
                });
            });
          }
        }
      ); 
    }
  }; 