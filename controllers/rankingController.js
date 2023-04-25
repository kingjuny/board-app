const postModel = require('../models/post')

const limit =10;
exports.getRankingPage= (req,res) => {
 
    postModel.getDayTop10Post(limit,(error, data) => {
        
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else {
            res.render("pages/ranking", {results:data});
        }
    });
}

exports.getDayBest= (req,res) => {

    postModel.getDayTop10Post(limit,(error, data) => {
        
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else {
            res.send({results:data});
        }
    });
}

exports.getWeekBest= (req,res) => {
    
    postModel.getWeekTop10Post(limit,(error, data) => {
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else {
            res.send({results:data});
        }
    });
}

exports.getMonthBest= (req,res) => {

    postModel.getMonthTop10Post(limit,(error, data) => {
        
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else {
            res.send({results:data});
        }
    });
}