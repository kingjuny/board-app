const boardModel = require('../models/board')
const postModel = require('../models/post')

const ITEMS_PER_PAGE=5;
exports.gethomepage=(req,res) => {
    const page = 1
    boardModel.getAllPosts(page,ITEMS_PER_PAGE,(error,data) => {
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else {
            postModel.getMonthTop10Post(ITEMS_PER_PAGE,(error,monthbest) => {
                console.log(monthbest)
                if (error) {
                    console.log(error);
                    res.sendStatus(500);
                } else {
                    res.render("pages/home", {allposts: data, monthbest:monthbest });
                }
            })
        }
    })
   
}