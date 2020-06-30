const express = require('express');
const app = express.Router();
const jwt = require('jsonwebtoken');
const jwtKey = 'uasidjasjoteme(($$$fafaskl$@8*$U@$((!($I!($U*!$&$';

//Models
const Friend = require('../models/Friend');
const { listenerCount } = require('../models/Friend');

//Get Friends
app.get('/', checkValidity, (req, res) => {
    Friend
        .find({})
        .then(data => {
            jwt.verify(req.token, jwtKey, (err, authData) => {
                if(err) 
                    res.json({
                        status: false,
                        msg: 'Token expired'
                    });
                else {
                    const filteredData = data.map(d => {
                        return {
                            username: d.username,
                            email: d.email,
                        }
                    });
                    Friend
                        .findOne({username: authData.user.username})
                        .then(user => {
                            res.json({
                                status: true,
                                user,
                                users: filteredData
                            });
                        });
                }
            });
        });
});

//Sign up as a friend
app.post('/signup', (req, res) => {
    if(req.body.username && req.body.email && req.body.password) {
        //Check if username exists
        Friend
            .findOne({username: req.body.username})
            .then(user => {
                if(user)
                    res.json({
                        status: false,
                        msg: 'User already exists'
                    });
                else {
                    //Create Friend
                    new Friend({
                        username: req.body.username,
                        password: req.body.password,
                        email: req.body.email
                    })
                        .save()
                        .then((user) =>  {
                            jwt.sign({user}, jwtKey, {expiresIn: '20d'}, (err, token) => {
                                res.json({
                                    status: true,
                                    msg: 'Signed up successfuly',
                                    token
                                });
                            });
                        });
                }
            });
    } else
        res.json({
            status: false,
            msg: 'Please fill required fields'
        });
});

//Sign in 
app.post('/signin', (req, res) => {
    if(req.body.username && req.body.password) {
        //Find Friend
        Friend
            .findOne({username: req.body.username, password: req.body.password})
            .then(user => {
                if(user) {
                    jwt.sign({user}, jwtKey, {expiresIn: '20d'}, (err, token) => {
                        res.json({
                            status: true,
                            msg: 'Welcome ' + user.username,
                            token
                        });
                    });
                } else
                    res.json({
                        status: false,
                        msg: 'User is not valid'
                    });
            });
    } else
        res.json({
            status: false,
            msg: 'Please fill required fields'
        });
});

//Send a friend request
app.post('/send/request', checkValidity, (req, res) => {
    jwt.verify(req.token, jwtKey, (err, authData) => {
        if(err) 
            res.json({
                status: false,
                msg: 'Token expired'
            });
        else {
            if(req.body.friendUsername) {
                //Check if the user and friend's username is the same
                if(req.body.friendUsername === authData.user.username)
                    res.json({
                        status: false,
                        msg: 'You can\'t send a friend request to your own account!!!!'
                    });
                else {
                    //Get friend from databasse
                    Friend
                        .findOne({username: req.body.friendUsername})
                        .then(friend => {
                            if(friend) {
                                //Check if the friend, is actually a friend
                                if(authData.user.friends.includes(friend.username)) 
                                    res.json({
                                        status: false,
                                        msg: 'Users are already friends'
                                    });
                                else {
                                    //Get the friends of both users(filtered)
                                    const friendFriendRequests = friend.friendRequests.filter(u => u !== authData.user.username);
                                    friendFriendRequests.push(authData.user.username);
                                    Friend
                                        .updateOne({username: req.body.friendUsername}, {friendRequests: friendFriendRequests})
                                        .then(() => {
                                            res.json({
                                                status: true,
                                                msg: 'Friend request sent'
                                            });
                                        });
                                }
                            } else  
                                res.json({
                                    status: false,
                                    msg: 'User doesn\'t exist'
                                });
                        });
                }
            } else  
                res.json({
                    status: false,
                    msg: 'Please fill required fields'
                });
        }
    });
});

//Cancel a friend request
app.post('/cancel/request', checkValidity, (req, res) => {
    if(req.body.friendUsername) {
        jwt.verify(req.token, jwtKey, (err, authData) => {
            if(err)
                res.json({
                    status: false,
                    msg: 'Token has expired'
                });
            else {
                const filteredFriendRequests = authData.user.friendRequests.filter(u => u !== req.body.friendUsername);
                Friend
                    .updateOne({_id: authData.user._id}, {friendRequests: filteredFriendRequests})
                    .then(() => res.json({
                        status: true,
                        msg: 'Friend request cancelled'
                    }));
            }
        });
    } else
        res.json({
            status: false,
            msg: 'Please fill required fields'
        });
});

//Accept friend request

//Delete friend

//Check if token is valid
function checkValidity(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader;
        req.token = bearerToken.split("Bearer ")[1];
        next();
    } else {
        res.sendStatus(403);
    }
}

module.exports = app;
