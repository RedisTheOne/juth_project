const express = require('express');
const app = express.Router();

//Models
const Friend = require('../models/Friend');
const Score = require('../models/Score');

//Get Scores
app.get('/', (req, res) => {
    Score.find({})
        .then(data => {
            res.json({
                status: true,
                scores: data
            });
        })
        .catch(err => res.json({
            status: false,
            msg: `Error occurred: ${err}`
        }));
});

//Create Score
app.post('/add', (req, res) => {
    if(req.body.score && req.body.user) {
        new Score({
            user: req.body.user,
            score: req.body.score
        })
            .save()
            .then(() => {
                res.json({status: true, msg: 'Score added!'});
            });
    } else
        res.json({
            status: false,
            msg: 'Fill required fields'
        });
});

//All Time
app.get('/structured/all-time/', async(req, res) => {
    Friend
        .find({})
        .then(users => {
            const finalData = users.map(async (user) => {
                let scoreSum = 0;
                const scores = await Score.find({user: user.username});
                scores.forEach((s) => scoreSum += s.score);
                let rank = '';
                if(scoreSum <= 1000)
                    rank = 'D';
                if(scoreSum > 1000 && scoreSum <= 5000)
                    rank = 'C';
                if(scoreSum > 5000 && scoreSum <= 10000)
                    rank = 'B';
                if(scoreSum > 10000 && scoreSum <= 20000)
                    rank = 'A';
                if(scoreSum > 20000)
                    rank = 'S';
                return {
                    user: user.username,
                    score: scoreSum,
                    rank: rank
                }
            });

            Promise
            .all(finalData)
            .then(completed => {
                let data = completed;
                data = data.sort((a, b) => b.score - a.score);
                res.json({
                    status: true,
                    data
                });
            });
        });
});

//Get Score and rank of a user
app.get('/structured/user/:name', (req, res) => {
    Friend
        .findOne({username: req.params.name})
        .then(user => {
            if(!user)
                res.json({
                    status: false,
                    msg: 'User don\'t exist'
                });
            else {
                Score
                    .find({user: user.username})
                    .then(scores => {
                        let scoreSum = 0;
                        scores.forEach((s) => {
                            scoreSum += s.score;
                        });
                        let rank = '';
                        if(scoreSum <= 1000)
                            rank = 'D';
                        if(scoreSum > 1000 && scoreSum <= 5000)
                            rank = 'C';
                        if(scoreSum > 5000 && scoreSum <= 10000)
                            rank = 'B';
                        if(scoreSum > 10000 && scoreSum <= 20000)
                            rank = 'A';
                        if(scoreSum > 20000)
                            rank = 'S';
                        res.json({
                            user: user.username,
                            score: scoreSum,
                            rank
                        });
                    });
            }
        });
});

//Past month
app.get('/structured/last-month/', async(req, res) => {
    Friend
        .find({})
        .then(users => {
            const finalData = users.map(async (user) => {
                let scoreSum = 0;
                const scores = await Score.find({user: user.username});
                scores.forEach((s) => {
                    const date1 = new Date(s.date);
                    const date2 = new Date();
                    const dateDiff = Math.floor((date2.getTime() - date1.getTime()) / (1000 * 3600 * 24));
                    if(dateDiff <= 30) {
                        scoreSum += s.score;
                    }
                });
                let rank = '';
                if(scoreSum <= 1000)
                    rank = 'D';
                if(scoreSum > 1000 && scoreSum <= 5000)
                    rank = 'C';
                if(scoreSum > 5000 && scoreSum <= 10000)
                    rank = 'B';
                if(scoreSum > 10000 && scoreSum <= 20000)
                    rank = 'A';
                if(scoreSum > 20000)
                    rank = 'S';
                return {
                    user: user.username,
                    score: scoreSum,
                    rank
                }
            });

            Promise
            .all(finalData)
            .then(completed => {
                let data = completed;
                data = data.sort((a, b) => b.score - a.score);
                res.json({
                    status: true,
                    data
                });
            });
        });
});

//Past week
app.get('/structured/last-week/', async(req, res) => {
    Friend
        .find({})
        .then(users => {
            const finalData = users.map(async (user) => {
                let scoreSum = 0;
                const scores = await Score.find({user: user.username});
                scores.forEach((s) => {
                    const date1 = new Date(s.date);
                    const date2 = new Date();
                    const dateDiff = Math.floor((date2.getTime() - date1.getTime()) / (1000 * 3600 * 24));        
                    if(dateDiff <= 7) {
                        scoreSum += s.score;
                    }
                });
                let rank = '';
                if(scoreSum <= 1000)
                    rank = 'D';
                if(scoreSum > 1000 && scoreSum <= 5000)
                    rank = 'C';
                if(scoreSum > 5000 && scoreSum <= 10000)
                    rank = 'B';
                if(scoreSum > 10000 && scoreSum <= 20000)
                    rank = 'A';
                if(scoreSum > 20000)
                    rank = 'S';
                return {
                    user: user.username,
                    score: scoreSum,
                    rank
                }
            });

            Promise
            .all(finalData)
            .then(completed => {
                let data = completed;
                data = data.sort((a, b) => b.score - a.score);
                res.json({
                    status: true,
                    data
                });
            });
        });
});

module.exports = app;