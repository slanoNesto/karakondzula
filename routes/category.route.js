var bodyParser = require('body-parser');
var authService = require('../services/auth.service');

module.exports = function (app) {

    var Category = require('../models/category.model');
    var BASE = require('../config').baseUrl;

    app.use(bodyParser.json());

    //GET LIST
    app.get(BASE + '/categories', function(req, res) {
        authService.authorize(req, res, function (user) {
            Category.getCategories(user, function(err, categories) {
                if (err) { res.status(500).send(err); return; }
                res.json(categories);
            });
        });
    });

    //GET ONE
    app.get(BASE + '/categories/:_id', function(req, res) {
        authService.authorize(req, res, function (user) {
            var id = req.params._id;
            Category.getCategory(id, user, function(err, categories) {
                if (err) { res.status(500).send(err); return; }
                res.json(categories);
            });
        });
    });

    //CREATE NEW
    app.post(BASE + '/categories', function(req, res) {
        var data = req.body;
        authService.authorize(req, res, function (user) {
            Category.createCategory(data, user, function(err, category) {
                if (err) { res.status(500).send(err); return; }
                res.status(201).json(category);
            });
        });
    });

    //UPDATE
    app.patch(BASE + '/categories/:_id', function(req, res) {
        var id = req.params._id,
            data = req.body;
        authService.authorize(req, res, function (user) {
            Category.updateCategory(id, data, user, function (err, category) {
                if (err) {
                    res.status(500).send(err);
                    return;
                }
                res.json(category);
            });
        });
    });

    //DELETE
    app.delete(BASE + '/categories/:_id', function(req, res) {
        var id = req.params._id;
        authService.authorize(req, res, function (user) {
            Category.deleteCategory(id, user, function (err, category) {
                if (err) {
                    res.status(500).send(err);
                    return;
                }
                res.status(204).json(category);
            });
        });
    });

};