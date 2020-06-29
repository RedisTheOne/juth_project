const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 5000;

//Database Connection
mongoose.connect('mongodb+srv://redus:redis06122002!@cluster0-xwsm9.mongodb.net/juthapp?retryWrites=true&w=majority', {useUnifiedTopology: true, useNewUrlParser: true})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Error connecting to MongoDb'));

app.use(express.json());

app.use('/scores', require('./routes/scores'));
app.use('/users', require('./routes/users'));
app.use('/friends', require('./routes/friends'));

app.listen(PORT, () => console.log(`Server started at port: ${PORT}`));