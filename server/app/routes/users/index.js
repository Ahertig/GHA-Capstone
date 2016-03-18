'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');
var User = mongoose.model('User');

//Create a user
router.post('/', function(req, res, next) {
	User.create(req.body)
	.then(function(newUser) {
		res.send(newUser)
	})
	.then(null, next)
})

//Get all users
router.get('/', function(req, res, next){
  User.find()
  .then(function(allUsers){
    res.json(allUsers);
  })
  .then(null, next);
});