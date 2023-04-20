const userModel = require('../models/user')
const postModel = require('../models/post')

exports.getMyPage=(req, res) => {
    userModel.getAllUsers((err, rows) => {
      console.log(req.session.user)
      if (err) throw err;
      const article = rows.find(art => art.id === req.session.user);
      if(!article) {
      return res.status(404).send('ID was not found.');
      }    
      postModel.getMyPost([req.session.user], (error, results) => {
        if (error) throw error;
        postModel.getLikePost([req.session.user], (error, likes) => {
          if (error) throw error;
          else{
            res.render('pages/mypage',{ session : req.session , article : article , results: results , likes: likes});
          }
        });
      });
      
    })
  }

  //프로필 이미지 변경
exports.updateProfileImg=(req, res) => {
    const file = req.file; // 업로드한 파일 정보
    const userId = req.session.user; // 사용자 아이디
    const previousProfileImagePath = req.body.profile_image_url; // 이전 프로필 이미지 경로
    const profileImagePath = file ? `/profile/${file.filename}` : null; // 프로필 사진 파일 경로
    const params =[profileImagePath, userId]
   // 프로필 사진 파일 경로
    console.log(previousProfileImagePath)
    // MySQL 데이터베이스에서 사용자 정보 업데이트
    userModel.updateProfile_image_url(params, (error, results) => {
      if (error) throw error;
      
      // 업데이트 성공 시
      res.redirect('/mypage');
    });
  };