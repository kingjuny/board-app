const express = require('express');
const router = express.Router();
const connection = require('../db');
//게시물 전체조회
const ITEMS_PER_PAGE = 15;

router.get("/", (req, res) => {
  let page = req.query.page || 1;
  let offset = (page - 1) * ITEMS_PER_PAGE;
  
  connection.query(
    "SELECT b.*, u.nickname FROM board b INNER JOIN users u ON b.writer = u.id LIMIT ?, ?",
    [offset, ITEMS_PER_PAGE],
    function (error, results, fields) {
      if (error) throw error;
      else {
        connection.query(
          "SELECT COUNT(*) AS count FROM board",
          function (error, countResult, fields) {
            if (error) throw error;
            else {
              let totalItems = countResult[0].count;
              let totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
              let pageRange = [];

              for (let i = 1; i <= totalPages; i++) {
                pageRange.push(i);
              }

              res.render("pages/all_post", {
                results: results,
                currentPage: page,
                pageRange: pageRange,
                totalPages: totalPages,
              });
            }
          }
        );
      }
    }
  );
});

router.get('/search', (req, res)=> {
    const q = req.query.search_post;
    let page = req.query.page || 1;
    let offset = (page - 1) * ITEMS_PER_PAGE;
  
    var query = "SELECT b.*, u.nickname FROM board b INNER JOIN users u ON b.writer = u.id WHERE b.title LIKE ? OR b.content LIKE ? OR u.nickname LIKE ? LIMIT ?, ?";
    var values = ["%" + q + "%", "%" + q + "%", "%" + q + "%",offset, ITEMS_PER_PAGE];
  
    connection.query(query, values, function(error, results, fields) {
      if (error) throw error;
      else {
        connection.query(
          "SELECT COUNT(*) AS count FROM board WHERE title LIKE ? OR content LIKE ?",
          ["%" + q + "%", "%" + q + "%"],
          function (error, countResult, fields) {
            if (error) throw error;
            else {
              let totalItems = countResult[0].count;
              let totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
              let pageRange = [];
  
              for (let i = 1; i <= totalPages; i++) {
                pageRange.push(i);
              }
  
              res.render('pages/search_results', {
                results: results,
                currentPage: page,
                pageRange: pageRange,
                totalPages: totalPages
              });
            }
          }
        );
      }
    });
  });
module.exports=router;