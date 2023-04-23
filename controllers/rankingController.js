const postModel = require('../models/post')

exports.getRankingPage= (req,res) => {

    postModel.getDayTop10Post((error, data) => {
        
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else {
            res.render("pages/ranking", {results:data});
        }
    });
}

exports.getDayBest= (req,res) => {

    postModel.getDayTop10Post((error, data) => {
        
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else {
            res.send({results:data});
        }
    });
}

exports.getWeekBest= (req,res) => {
    
    postModel.getWeekTop10Post((error, data) => {
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else {
            res.send({results:data});
        }
    });
}

exports.getMonthBest= (req,res) => {

    postModel.getMonthTop10Post((error, data) => {
        
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else {
            res.send({results:data});
        }
    });
}