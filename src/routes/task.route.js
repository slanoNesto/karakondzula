var bodyParser = require('body-parser');
var authService = require('../services/auth.service.js');

module.exports = function (app) {

    var mongoose = require('mongoose');
    var Task = require('../models/task.model');
    var BASE = require('../config').baseUrl;

    app.use(bodyParser.json());

    //GET LIST
    app.get(BASE + '/categories/:categoryId/tasks', function(req, res) {
        authService.authorize(req, res, function (user) {
            Task.getTasks(req.params.categoryId, user, function (err, tasks) {
                if (err) {
                    res.status(500).send(err);
                    return;
                }
                mongoose.model('Task').populate(tasks, {path: 'category'}, function (err, tasks) {
                    res.json(tasks);
                });
            });
        });
    });

    //GET ONE
    app.get(BASE + '/categories/:categoryId/tasks/:_id', function(req, res) {
        var categoryId = req.params.categoryId,
            taskId = req.params._id;
        authService.authorize(req, res, function (user) {
            Task.getTask(categoryId, taskId, user, function (err, task) {
                if (err) {
                    res.status(500).send(err);
                    return;
                }
                mongoose.model('Task').populate(task, {path: 'category'}, function (err, task) {
                    res.json(task);
                });
            });
        });
    });

    //CREATE NEW
    app.post(BASE + '/categories/:categoryId/tasks', validateRatingsOnCreate, function(req, res) {
        authService.authorize(req, res, function (user) {
            var categoryId = req.params.categoryId,
                data = req.body;
            Task.createTask(categoryId, data, user, function (err, task) {
                if (err) {
                    res.status(400).send(err);
                    return;
                }
                res.status(201).json(task);
            });
        });
    });

    //UPDATE
    app.patch(BASE + '/categories/:categoryId/tasks/:_id', validateRatingsOnUpdate, function(req, res) {
        var id = req.params._id,
            data = req.body;
        authService.authorize(req, res, function (user) {
            Task.updateTask(id, data, user, function (err, task) {
                if (err) {
                    res.status(500).send(err);
                    return;
                }
                res.json(task);
            });
        });
    });

    //DELETE
    app.delete(BASE + '/categories/:categoryId/tasks/:_id', function(req, res) {
        var id = req.params._id;
        authService.authorize(req, res, function (user) {
            Task.deleteTask(id, user, function (err, task) {
                if (err) {
                    return res.status(500).send(err);
                }

                if (!task) {
                    return res.status(404).send({
                        message: 'Not found'
                    });
                }

                res.status(204).json(task);
            });
        });
    });

    function validateRatingsOnCreate(req, res, next) {
        var categoryId = req.params.categoryId,
            data = req.body;
        authService.authorize(req, res, function (user) {
            Task.getTasks(categoryId, user, function (err, tasks) {
                var alreadyAddedRating = tasks.reduce(function (all, item) {
                    return all + item.rating;
                }, 0);

                var allowed = 100 - alreadyAddedRating;

                if (alreadyAddedRating === 100) {
                    return res.status(400).send({message: 'This category already has 100 rating worth of tasks. Consider rearranging your task ratings.'});
                } else if (alreadyAddedRating + data.rating > 100) {
                    return res.status(400).send({message: 'You cant add more then 100 rating on one category. For this task you can add a maximum of ' + allowed + ' rating to get to 100'});
                } else {
                    next();
                }
            });
        });
    }

    function validateRatingsOnUpdate(req, res, next) {
        var data = req.body,
            taskId = req.params._id,
            categoryId = req.params.categoryId;

        authService.authorize(req, res, function (user) {
            Task.getTasks(categoryId, user, function (err, tasks) {
                var alreadyAddedRating = tasks.reduce(function (all, item) {
                    if (item._id == taskId) {
                        item.rating = data.rating || item.rating;
                    }
                    return all + item.rating;
                }, 0);

                if (alreadyAddedRating > 100) {
                    return res.status(400).send({message: 'You cant add more then 100 rating on one category. With this settings the sum is ' + alreadyAddedRating});
                } else {
                    next();
                }
            });
        });
    }

};