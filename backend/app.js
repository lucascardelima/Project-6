const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express(); 

const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauces');

mongoose.connect('mongodb+srv://lucalim:9t6drVs1V8Rl7eag@cluster0.orwmh.mongodb.net/?retryWrites=true&w=majority')
    .then(() => {
        console.log('Connected to database!');
    })
    .catch((error) => {
        console.log('Connection failed!');
        console.log(error);
    });

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', userRoutes);
app.use('/api', saucesRoutes);

module.exports = app;