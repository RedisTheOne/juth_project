const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 5000;

//Database Connection
mongoose.connect('mongodb+srv://redus:redis06122002!@cluster0-xwsm9.mongodb.net/juthapp?retryWrites=true&w=majority', {useUnifiedTopology: true, useNewUrlParser: true})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Error connecting to MongoDb'));

//Models
const User = require('./models/User');
const Score = require('./models/Score');

app.use(express.json());

//Get Users
app.get('/users', (req, res) => {
    User.find({})
        .then(data => {
            res.json({
                status: true,
                users: data
            });
        })
        .catch(err => res.json({
            status: false,
            msg: `Error occurred: ${err}`
        }));
});

//Get Scores
app.get('/scores', (req, res) => {
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

//Create User
app.post('/users/add', (req, res) => {
    if(req.body.user) {
        User.findOne({user: req.body.user})
            .then(data => {
                if(data)
                    res.json({status: true, msg: 'Welcome ' + req.body.user + '!'});
                else {
                    new User({
                        user: req.body.user
                    })
                        .save()
                        .then(() => {
                            res.json({status: true, msg: 'User created!'});
                        });
                }
            });
    } else
        res.json({
            status: false,
            msg: 'Fill required fields'
        });
});

//Create Score
app.post('/scores/add', (req, res) => {
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

//Get Scores Structured
//All Time
app.get('/scores/structured/all-time/', async(req, res) => {
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
app.get('/scores/structured/last-month/', async(req, res) => {
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
app.get('/scores/structured/last-week/', async(req, res) => {
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



app.listen(PORT, () => console.log(`Server started at port: ${PORT}`));