'use strict';

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();

/* A secret. */
const secret = 's3cret1!@#$%asdf';

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/auth', function (req, res) {

  /* A dummy password check for authentication. */
  if (!(req.body.username === 'admin' && req.body.password === 'admin')) {
    res.send(401, 'Wrong user or password');
    return;
  }

  /* A dummy user data. */
  const profile = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@doe.com',
    id: 1234
  };

  /* Will be valid for 5 minutes. */
  const token = jwt.sign(profile, secret, {expiresIn: 300}); //5mins
  res.json({token: token, profile: profile});
});

/* Server */
app.set('port', 3471);

const server = app.listen(app.get('port'), function () {
  console.log(`Auth server is running on port ${app.get('port')} with /auth endpoint for authentication.`);
});
