'use strict';

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/ididit');

const User = require('./model/User');
const utils = require('./utils/utils');

/* A secret. */
const secret = 's3cret1!@#$%asdf';

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/auth/login', function (req, res) {  
  const user = User.findOne({email: req.body.email}, 'email password')
    .then((profile) => {
        console.log('profile:', profile);
      if (profile.password === utils.encryptPassword(req.body.password)) {
          profile = {email: profile.email};
          const token = jwt.sign(profile, secret, {expiresIn: 300}); //5mins
          return res.json({token: token, profile});  
      }
      throw new Error();
    }).catch((err) => {
        return res.send(401, 'Wrong user or password');
    });
});

app.post('/auth/availability', function (req, res) {
    
});

app.post('/auth/register', function (req, res) {
    const user = new User({
        email: req.body.email,
        password: utils.encryptPassword(req.body.password),
        achievements: [
            {
                title: 'First achievement',
                content: 'You just registered!'
            }
        ]
    });
    user.save()
        .then((profile) => {
            return res.json({email: profile.email});
        })
        .catch((err) => {
            console.log('err:', err);
            return res.status(500).end();
        });
});

/* Server */
app.set('port', 3471);

const server = app.listen(app.get('port'), function () {
  console.log(`Auth server is running on port ${app.get('port')}.`);
});
