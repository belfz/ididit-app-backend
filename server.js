var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
var cors = require('cors');
var app = express();

var secret = 's3cret1!@#$%asdf';

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api', expressJwt({secret: secret}));

app.post('/auth', function (req, res) {
  if (!(req.body.username === 'admin' && req.body.password === 'admin')) {
    res.send(401, 'Wrong user or password');
    return;
  }

  var profile = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@doe.com',
    id: 1234
  };

  var token = jwt.sign(profile, secret, {expiresIn: 300}); //5mins
  res.json({token: token});
});

app.get('/api/restricted', function (req, res) {
  console.log(req.user);
  console.log('user ' + req.user.email + ' is calling /api/restricted');
  res.json(req.user);
});

/*
 * Server
 *
 */
app.set('port', 3470);

var server = app.listen(app.get('port'), function () {
  console.log('data mock server is running');
});