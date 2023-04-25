// controllers/boardController.js
const boardModel = require('../models/board');
const ITEMS_PER_PAGE = 15;
exports.getAllPosts = (req, res) => {
    let page = req.query.page || 1;

    boardModel.getAllPosts(page,ITEMS_PER_PAGE, (error, data) => {
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else {
            res.render("pages/all_post", data);
        }
    });
};

exports.searchPost = (req, res) => {
    const q = req.query.search_post;
    let page = req.query.page || 1;

    boardModel.searchPost(q, page,ITEMS_PER_PAGE, (error, data) => {
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else {
            res.render("pages/search_results", data);
        }
    });
};
module.exports = exports;