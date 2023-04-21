// writeModel.js
const connection = require('./db');

exports.insertPost = (params, callback) => {
  connection.query('INSERT INTO board (title, writer, content, image_path) VALUES (?, ?, ?, ?);', params, (err, results) => {
    if (err) {
        console.log(err);
        callback(err, null);
    } else {

      callback(null, results);
    }
  });      
};

exports.getPost = (id, callback) => {
  connection.query('SELECT b.*, u.nickname, u.profile_image_url FROM board b INNER JOIN users u ON b.writer = u.id WHERE b.idx = ?', [id], (err, rows) => {
    if (err) {
      return callback(err);
    }
    if (rows.length === 0) {
      return callback(null, null);
    }
    callback(null, rows[0]);
  });
};

exports.updateViewCnt = (id, callback) => {
  connection.query('UPDATE board SET view_cnt = view_cnt + 1 WHERE idx = ?', [id], (err) => {
    if (err) {
      return callback(err);
    }
    callback(null);
  });
};
//*************************** */
exports.getComments = (id, callback) => {
  connection.query('SELECT b.*, u.nickname, u.profile_image_url FROM comment b INNER JOIN users u ON b.writer = u.id WHERE board_id = ? ORDER BY created_at DESC;', [id], (err, rows) => {
    if (err) {
      return callback(err);
    }
    callback(null, rows);
  });
};

exports.getReplies = (id, callback) => {
  connection.query('SELECT r.*, u.nickname, u.profile_image_url FROM reply r INNER JOIN users u ON r.writer = u.id INNER JOIN comment c ON r.comment_id = c.id WHERE c.board_id = ? ORDER BY r.created_at ASC;', [id], (err, rows) => {
    if (err) {
      return callback(err);
    }
    callback(null, rows);
  });
};
//************************** */



//글 수정 화면
exports.getAllPost = (callback) => {
  connection.query('SELECT * from board', (err, rows) => {
    if (err) {
      return callback(err);
    }
    callback(null, rows);
  })
}
exports.updatePost = (params,callback) => {
  connection.query('UPDATE board SET title = ?, writer = ?, content = ? WHERE idx = ?', params, (err, rows) => {
  if (err) {
  return callback(err);
  }
  callback(null, rows);
  })
  }

  exports.deletePost = (postid, callback) => {
    connection.query('DELETE FROM board WHERE idx = ?', postid, (err, rows) => {
      if (err) {
        return callback(err);
        }
        callback(null, rows);
    })
  };

  exports.getMyPost = (user, callback) => {
    connection.query('SELECT * FROM board WHERE writer = ?;', user, (err, rows) => {
      if (err) {
        return callback(err);
        }
        callback(null, rows);
    })
  };

  exports.getLikePost = (user, callback) => {
    connection.query(
      'SELECT likes.board_id, likes.user_id, likes.created_at, board.idx, board.title, board.likes_cnt, users.nickname FROM likes INNER JOIN board ON likes.board_id = board.idx INNER JOIN users ON board.writer = users.id WHERE likes.user_id =?;'
    , user, (err, rows) => {
      if (err) {
        return callback(err);
        }
        callback(null, rows);
    })
  };


