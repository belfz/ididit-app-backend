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

function getAuthSuccessResponseBody (profile, addRefreshToken) {
  //for refresh tokens: create the refresh tokens the same way as regular api tokens, but also encode the audience 
  //that says, that this is the refresh token or regular api token (regular api tokens can be used for api interaction)
  return {
    token: jwt.sign(profile, secret, {expiresIn: 30, audience: 'api'}), //5mins
    refreshToken: addRefreshToken ? jwt.sign(profile, secret, {audience: 'refresh_token'}) : undefined,
    profile
  };
}

app.post('/auth/login', function (req, res) {  
  User.findOne({email: req.body.email}, 'email password')
    .then((profile) => {
      if (profile.password === utils.encryptPassword(req.body.password)) {
        return res.json(getAuthSuccessResponseBody({email: profile.email}, req.body.refreshToken));  
      }
      throw new Error('Wrong email or password');
    }).catch((err) => {
      return res.send(401, err.message);
    });
});

//TODO MUST invalidate the previous refresh tokens!
app.post('/auth/refresh', function (req, res) {
  const refreshToken = req.body.refreshToken;
  const tokenDecoded = jwt.verify(refreshToken, secret);
  if (tokenDecoded.aud === 'refresh_token') {
    return User.findOne({email: tokenDecoded.email}, 'email')
      .then((profile) => {
        return res.json(getAuthSuccessResponseBody({email: tokenDecoded.email}, refreshToken));  
      })
      .catch((err) => {
        return res.send(401, err.message);
      });
  }
  return res.send(401, 'Invalid token type!');
});

app.post('/auth/availability', function (req, res) {
    //TODO implement in th future
});

app.post('/auth/register', function (req, res) {
    const user = new User({
        email: req.body.email,
        password: utils.encryptPassword(req.body.password),
        achievements: [
            {
                title: 'First achievement',
                content: 'You just registered!',
                done: true
            }
        ]
    });
    user.save()
        .then((profile) => {
            return res.json(getAuthSuccessResponseBody({email: profile.email}, req.body.refreshToken));
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
