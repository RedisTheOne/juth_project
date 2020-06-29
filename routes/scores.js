const express = require('express');
const app = express.Router();

//Models
const User = require('../models/User');
const Score = require('../models/Score');

//Get Scores
app.get('/', (req, res) => {
    Score.find({})
        .then(data => {
            res.json({
                status: true,
                score: data
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
    User
        .find({})
        .then(users => {
            const finalData = users.map(async (user) => {
                let scoreSum = 0;
                const scores = await Score.find({user: user.user});
                scores.forEach((s) => scoreSum += s.score);
                return {
                    user: user.user,
                    score: scoreSum
                }
            });

            Promise
            .all(finalData)
            .then(completed => res.json({
                status: true,
                data: completed
            }));
        });
});

//Past month
app.get('/structured/last-month/', async(req, res) => {
    User
        .find({})
        .then(users => {
            const finalData = users.map(async (user) => {
                let scoreSum = 0;
                const scores = await Score.find({user: user.user});
                scores.forEach((s) => {
                    const date1 = new Date(s.date);
                    const date2 = new Date();
                    const dateDiff = Math.floor((date2.getTime() - date1.getTime()) / (1000 * 3600 * 24));
                    console.log(dateDiff);
        
                    if(dateDiff <= 30) {
                        scoreSum += s.score;
                    }

                });
                return {
                    user: user.user,
                    score: scoreSum
                }
            });

            Promise
            .all(finalData)
            .then(completed => res.json({
                status: true,
                data: completed
            }));
        });
});

//Past week
app.get('/structured/last-week/', async(req, res) => {
    User
        .find({})
        .then(users => {
            const finalData = users.map(async (user) => {
                let scoreSum = 0;
                const scores = await Score.find({user: user.user});
                scores.forEach((s) => {
                    const date1 = new Date(s.date);
                    const date2 = new Date();
                    const dateDiff = Math.floor((date2.getTime() - date1.getTime()) / (1000 * 3600 * 24));        
                    if(dateDiff <= 7) {
                        scoreSum += s.score;
                    }

                });
                return {
                    user: user.user,
                    score: scoreSum
                }
            });

            Promise
            .all(finalData)
            .then(completed => res.json({
                status: true,
                data: completed
            }));
        });
});

module.exports = app;