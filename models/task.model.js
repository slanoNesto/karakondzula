var mongoose = require('mongoose');

var taskSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category'
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    rating: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    link: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    create_date: {
        type: Date,
        default: Date.now
    }
});

function getTasks(categoryId, user, callback, limit) {
    var query = {'category': categoryId, user: user._id};
    Task.find(query, callback).limit(limit);
}

function getTask(categoryId, taskId, user, callback) {
    var query = {'category': categoryId, _id: taskId, user: user._id};
    Task.findOne(query, callback);
}

function createTask(categoryId, data, user, callback) {
    if (!data.category) { data.category = {}; }
    if (!data.user) { data.user = {}; }
    data.category._id = categoryId;
    data.user._id = user._id;

    getTasks(categoryId, user, function(err, tasks) {
        var alreadyAddedRating = tasks.reduce(function(all, item) {
            return all + item.rating;
        }, 0);

        var allowed = 100 - alreadyAddedRating;

        if (alreadyAddedRating === 100) {
            return callback({message: 'This category already has 100 rating worth of tasks. Consider rearranging your task ratings.'});
        } else  if (alreadyAddedRating + data.rating > 100) {
            return callback({message: 'You cant add more then 100 rating on one category. For this task you can add a maximum of ' + allowed + ' rating to get to 100'});
        } else {
            Task.create(data, callback);
        }
    });
}

function editTask(id, data, user, options, callback) {
    var query = {_id: id, user: user._id};
    var update = {
        title: data.title,
        rating: data.rating,
        description: data.description,
        link: data.link,
        image: data.image
    };

    //TODO: implement maximum rating validation
    Task.findOneAndUpdate(query, update, options, callback);
}

function updateTask(id, data, user, callback) {
    var set = {};
    for (var param in data) {
        set[param] = data[param];
    }

    //TODO: implement maximum rating validation
    Task.findOneAndUpdate({_id: id, user: user._id}, { $set: set }, { new: true }, callback);
}

function deleteTask(id, user, callback) {
    var query = {_id: id, user: user._id};
    Task.findOneAndRemove(query, callback);
}

var Task = module.exports = mongoose.model('Task', taskSchema);

module.exports = {
    getTasks: getTasks,
    getTask: getTask,
    createTask: createTask,
    editTask: editTask,
    updateTask: updateTask,
    deleteTask: deleteTask
};