const connection = require('./db');

exports.insertComment = (params, callback) => {
    connection.query("INSERT INTO comment (writer, content, board_id) VALUES (?, ?, ?);" , params,(err, results) => {
        if (err) {
            callback(err, null);
        } 
        callback(null, results);
    });
};

exports.updateComment = (params, callback) => {
    connection.query("UPDATE comment SET content = ? WHERE id = ?;" , params,(err, results) => {
        if (err) {
            callback(err, null);
        } 
        callback(null, results);
    });
};

exports.deleteComment = (comment_id, callback) => {
    connection.query("DELETE FROM comment WHERE id = ?;" , comment_id,(err, results) => {
        if (err) {
            callback(err, null);
        } 
        callback(null, results);
    });
};


  
 