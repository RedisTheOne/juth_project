const express = require('express');
const app = express.Router();

//Models
const User = require('../models/User');

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

module.exports = app;