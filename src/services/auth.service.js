var bodyParser = require('body-parser');
var jwt = require('jwt-simple');
var SECRET = require('../config').secret;

var User = require('../models/user.model');

module.exports = {

    authorize: function (req, res, callback) {
        if (!req.headers.authorization) {
            return res.status(401).send({
                message: 'You are not authorized'
            });
        }

        var token = req.headers.authorization.split(' ')[1];
        try {
            var payload = jwt.decode(token, SECRET, true, 'HS512');
        } catch(err) {
            return res.status(401).send({
                message: 'Authentication failed'
            });
        }

        if (!payload || !payload.sub) {
            return res.status(401).send({
                message: 'Authentication failed'
            });
        }

        User.getUser({_id: payload.sub}, function(err, user) {
            callback(user);
        });
    }

};