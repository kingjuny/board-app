const connection = require('../db');

exports.checkDuplicate = (articleId, userId, callback) => {
  connection.query('SELECT * FROM likes WHERE board_id = ? AND user_id = ?', [articleId, userId], callback);
};

exports.deleteLike = (articleId, userId, callback) => {
  connection.query('DELETE FROM likes WHERE board_id = ? AND user_id = ?', [articleId, userId], callback);
};

exports.addLike = (articleId, userId, callback) => {
  connection.query('INSERT INTO likes (board_id, user_id) VALUES (?, ?);', [articleId, userId], callback);
};

