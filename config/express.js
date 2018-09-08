const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const loggerHttp = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');
//const refresh = require('passport-oauth2-refresh');

const config = rootRequire('./config/');
const logger = rootRequire('./config/logger');

module.exports = (app) => {

  // view engine setup
  app.set('views', path.join(__dirname, '../app/views'));
  app.set('view engine', 'pug');

  // session setup
  app.use(session({
    secret: config.session.secret,
    resave: false,
    saveUninitialized: false
  }));

  // uncomment after placing your favicon in /public
  //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

  //uncomment if you want to see access logs
  //app.use(loggerHttp('dev'));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: false
  }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, '../public')));

  // passport OpenID
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(new OAuth2Strategy({
      authorizationURL: 'https://192.168.57.2:9000/oauth2/auth',
      tokenURL: 'https://192.168.57.2:9000/oauth2/token',
      clientID: 'facebook-photo-backup',
      clientSecret: 'some-secret',
      callbackURL: 'https://192.168.29.3:3001/login/callback',
      state: true,
      scope: ['offline', 'openid', 'photos.read']
    },
    function(accessToken, refreshToken, profile, cb) {
      //logger.info(accessToken);
      User.findOrCreate({
        exampleId: profile.id
      }, function(err, user) {
        return cb(err, user);
      });
    }
  ));
  //passport.use('refresh', refresh)

};
