'use strict';

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();

const utils = require('./utils/utils');

const secret = 's3cret1!@#$%asdf';

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/ididit');

const User = require('./model/User');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api', expressJwt({secret: secret}));

app.get('/api/profile', function (req, res) {  
  User.findOne({email: req.user.email}, 'email')
    .then(profile => {
        res.json(profile).end();
    }).catch(err => {
        res.status(500).end();
    });
});

app.get('/api/achievements', function (req, res) {  
  User.findOne({email: req.user.email}, 'achievements')
    .then(profile => {
        res.json(profile).end();
    }).catch(err => {
        res.status(500).end();
    });
});

app.put('/api/achievements/:id', function (req, res) {
  User.findOne({email: req.user.email}, 'achievements')
    .then(profile => {
        Object.assign(profile.achievements.id(req.params.id), req.body);
        return profile.save();
    })
    .then(profile => {
        res.json(profile.achievements.id(req.params.id)).end();
    })
    .catch(err => {
        res.status(500).end();
    });
})

/*
 * Server
 *
 */
app.set('port', 3470);

const server = app.listen(app.get('port'), function () {
  console.log('data mock server is running');
});