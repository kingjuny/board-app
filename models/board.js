// models/board.js
const connection = require('../db');

const ITEMS_PER_PAGE = 15;

exports.getAllPosts = (page, callback) => {
  let offset = (page - 1) * ITEMS_PER_PAGE;
  const query = "SELECT b.*, u.nickname FROM board b INNER JOIN users u ON b.writer = u.id LIMIT ?, ?";
  const values = [offset, ITEMS_PER_PAGE];

  connection.query(query, values, (error, results) => {
    if (error) {
      callback(error, null);
    } else {
      connection.query("SELECT COUNT(*) AS count FROM board", (error, countResult) => {
        if (error) {
          callback(error, null);
        } else {
          let totalItems = countResult[0].count;
          let totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
          let pageRange = [];

          for (let i = 1; i <= totalPages; i++) {
            pageRange.push(i);
          }

          callback(null, {
            results: results,
            currentPage: page,
            pageRange: pageRange,
            totalPages: totalPages,
          });
        }
      });
    }
  });
};

exports.searchPost = (q, page, callback) => {
  let offset = (page - 1) * ITEMS_PER_PAGE;
  const query = "SELECT b.*, u.nickname FROM board b INNER JOIN users u ON b.writer = u.id WHERE b.title LIKE ? OR b.content LIKE ? OR u.nickname LIKE ? LIMIT ?, ?";
  const values = ["%" + q + "%", "%" + q + "%", "%" + q + "%", offset, ITEMS_PER_PAGE];

  connection.query(query, values, (error, results) => {
    if (error) {
      callback(error, null);
    } else {
      connection.query("SELECT COUNT(*) AS count FROM board WHERE title LIKE ? OR content LIKE ?", ["%" + q + "%", "%" + q + "%"], (error, countResult) => {
        if (error) {
          callback(error, null);
        } else {
          let totalItems = countResult[0].count;
          let totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
          let pageRange = [];

          for (let i = 1; i <= totalPages; i++) {
            pageRange.push(i);
          }

          callback(null, {
            results: results,
            currentPage: page,
            pageRange: pageRange,
            totalPages: totalPages,
          });
        }
      });
    }
  });
};
