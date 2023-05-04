// models/user.js
const connection = require('./db');
const crypto = require('crypto');


exports.login = (id, password, callback) => { 
    const sql = "SELECT * FROM users WHERE id=? ;";
    connection.query(sql, [id], (err, results) => {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            //로그인 아이디가 틀렸을때
            if (!results[0]) {
                console.log("아이디틀림");
                callback("Incorrect id", null);
            } else {
                const user = results[0];
                crypto.pbkdf2(password, user.salt, 1, 32, 'sha512', (err, derivedkey) => {
                    if (err) {
                        console.log(err);
                        callback(err, null);
                    }
                    if (derivedkey.toString('base64') === user.password) {
                        console.log("성공");
                        callback(null, user);
                    } else {
                        console.log("pw틀림");
                        callback("Incorrect password", null);
                    }
                });
            }
        }
    });
};
// 새로운 유저를 추가하는 메소드
exports.addUser = (userData, callback) => {
    const salt = crypto.randomBytes(32).toString('base64');
    const hashedPw = crypto.pbkdf2Sync(userData.password, salt, 1, 32, 'sha512').toString('base64');
    const params = [userData.email, userData.name, userData.nickname, userData.age, hashedPw, salt];
    
    connection.query('INSERT INTO `nodeapp`.`users` (`id`, `name`, `nickname`, `age`, `password`, `salt`) VALUES (?,?,?,?,?,?)', params, (err, result) => {
      if (err) {
        return callback(err, null);
      } else {
        return callback(null, result);
      }
    });
  };
  
  // 이메일로 유저 정보를 가져오는 메소드
  exports.checkEmail = (email, callback) => {
    connection.query('SELECT * FROM `nodeapp`.`users` WHERE `id` = ?', [email], (err, rows) => {
      if (err) {
        return callback(err, null);
      } else {
        return callback(null, rows[0]);
      }
    });
  };

  exports.getAllUsers = (callback) => {
    connection.query('SELECT * FROM users;', (err, rows) => {
      if (err) {
        return callback(err);
      }
      callback(null, rows);
    })
  }

  exports.updateProfile_image_url = (params,callback) => {
    connection.query('UPDATE users SET profile_image_url = ? WHERE id = ?', params,(err, rows) => {
      if (err) {
        return callback(err);
      }
      callback(null, rows);
    })
  }
  //유저 정보 삭제 메소드
  exports.dleteUser = (params,callback) => {
    connection.query('DELETE from users WHERE id = ?', params,(err, rows) => {
      if (err) {
        return callback(err);
      }
      callback(null, rows);
    })
  }
  
