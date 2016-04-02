// Instantiate all models
var mongoose = require('mongoose');
require('../../../server/db/models');
var User = mongoose.model('User');
var Notebook = mongoose.model('Notebook');

var expect = require('chai').expect;

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');
var app = require('../../../server/app');
var Promise = require('bluebird');

describe('Notebook Route', function () {

	beforeEach('Establish DB connection', function (done) {
		if (mongoose.connection.db) return done();
		mongoose.connect(dbURI, done);
	});

	afterEach('Clear test database', function (done) {
		clearDB(done);
	});

	describe('Authenticated request', function () {

		var loggedInAgent;

		var userInfo = {
			email: 'joe@gmail.com',
			password: 'shoopdawoop'
		};

		var user1
		// beforeEach('Create a user', function (done) {
		// 	User.create(userInfo)
		// 	.then(function (user) {
		// 		user1 = user;
		// 		return user.createNotebook({title: 'Another Notebook'})
		// 	})
		// 	.then(function(notebook) {
		// 		return notebook.createNote({subject: 'First note'})
		// 	})
		// 	.then(function(note) {
		// 		done()
		// 	})

		// });

			beforeEach('Create a user', function (done) {
			User.create(userInfo)
			.then(function (user) {
				user1 = user;
				return user.createNotebook({title: 'Another Notebook'})
			})
			.then(function(notebook) {
				Promise.all([notebook.createNote({subject: 'First note'}),
							 notebook.createNote({subject: 'Second note'})
				])
			})
			.then(function(notes) {
				done()
			})

		});

		beforeEach('Create loggedIn user agent and authenticate', function (done) {
			loggedInAgent = supertest.agent(app);
			loggedInAgent.post('/login').send(userInfo).end(done);
		});

		it('should get all notes for a user', function(done) {
			loggedInAgent.get('/api/notes').expect(200).end(function(err, response) {
				if (err) return done(err);
					console.log(response.body)
					expect(response.body).to.be.an('array');
					expect(response.body.length).to.equal(2);
					expect(response.body[0].subject).to.equal('First note');
					expect(response.body[1].subject).to.equal('Second note');
					done()
			})
		})



	});

});












