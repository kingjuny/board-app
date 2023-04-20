const commentModel = require('../models/comment')
const postModel = require('../models/post')

//게시판 댓글 생성
exports.writeComment = (req, res) => {
    const params =[req.session.user, req.body.comment_content, req.params.id]
    commentModel.insertComment(params,(err, rows) => {
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
    });
};

exports.commentAction = (req, res) => {
    if(req.params.action==="edit"){ 
      console.log(req.body.boardId)
      const params = [req.body.content, req.params.id];
      commentModel.updateComment(params,(err, rows) => {
          if (err) throw err;
          else {  
            console.log(`${req.params.id}번 댓글 수정`);
            //댓글 조회
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
      commentModel.deleteComment([req.params.id],(err, rows) => {
          if (err) throw err;
          else {  
            console.log(`${req.params.id}번 댓글 삭제`);
            
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
    }
  };    
  
 