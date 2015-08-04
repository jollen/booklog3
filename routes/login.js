var express = require('express');
var router = express.Router();
var passport = require('passport');


/* FB auth */

router.get('/login/facebook', 
  passport.authenticate('facebook'));

router.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

router.get('/login', function(req, res, next){
  res.render('login', { title: 'Login', message: 'Welcome to here!'});
});

module.exports = router;
