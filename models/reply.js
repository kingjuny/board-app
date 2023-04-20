const connection = require('../db');

exports.insertReply = (params, callback) => {
    connection.query("INSERT INTO reply (writer, content, comment_id) VALUES (?, ?, ?);" , params,(err, results) => {
        if (err) {
            callback(err, null);
        } 
        callback(null, results);
    });
};

exports.updateReply = (params, callback) => {
    connection.query("UPDATE reply SET content = ? WHERE id = ?;" , params,(err, results) => {
        if (err) {
            callback(err, null);
        } 
        callback(null, results);
    });
};

exports.deleteReply = (reply_id, callback) => {
    connection.query("DELETE FROM reply WHERE id = ?;" , reply_id,(err, results) => {
        if (err) {
            callback(err, null);
        } 
        callback(null, results);
    });
};