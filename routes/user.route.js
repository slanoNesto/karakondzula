var bodyParser = require('body-parser');
var jwt = require('jwt-simple');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function (app) {

    var User = require('../models/user.model');
    var BASE = require('../config').baseUrl;
    var SECRET = require('../config').secret;

    app.use(bodyParser.json());

    app.use(passport.initialize());
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    var loginStrategy = new LocalStrategy({
        usernameField: 'email'
    }, function(email, password, done) {
        User.getUser({email: email}, function(err, user) {
            if (err) return done(err);

            if (!user) {
                return done(null, false, {
                    message: 'Wrong email/password'
                });
            }

            user.comparePasswords(password, function(err, isMatch) {
                if (err) return done(err);

                if (!isMatch) {
                    return done(null, false, {
                        message: 'Wrong email/password'
                    });
                }

                return done(null, user);
            });
        });
    });

    passport.use(loginStrategy);

    app.get(BASE + '/users', function(req, res) {
        User.getUsers(function(err, users) {
            if (err) { res.status(500).send(err); return; }
            res.json(users);
        });
    });

    app.get(BASE + '/users/:_id', function(req, res) {
        User.getUser({_id: req.params._id}, function(err, user) {
            if (err) { res.status(500).send(err); return; }
            res.json(user);
        });
    });

    app.post(BASE + '/register', function(req, res) {
        var data = req.body;

        User.getUser({email: data.email}, function(err, user) {
            if (err) { res.status(500).send(err); return; }

            if (user) {
                res.status(400).send({
                    message: 'Email already exist'
                })
            } else {
                User.createUser(data ,function(err, user) {
                    if (err) { res.status(500).send(err); return; }

                    createTokenAndSend(user, res, true);
                });
            }
        });
    });

    app.post(BASE + '/login', passport.authenticate('local'), function(req, res) {
        createTokenAndSend(req.user, res);
    });

    function createTokenAndSend(user, res, register) {
        var payload = {
            sub: user._id
        };

        var token = jwt.encode(payload, SECRET);

        var status = register ? 201 : 200;

        res.status(status).send({
            user: user.toJSON(),
            token: token
        });
    }

};