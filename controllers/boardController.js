// controllers/boardController.js
const boardModel = require('../models/board');

exports.getAllPosts = (req, res) => {
    let page = req.query.page || 1;

    boardModel.getAllPosts(page, (error, data) => {
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

    boardModel.searchPost(q, page, (error, data) => {
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else {
            res.render("pages/search_results", data);
        }
    });
};
module.exports = exports;