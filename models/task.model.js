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

    Task.create(data, callback);
}

function updateTask(id, data, user, callback) {
    var set = {};
    for (var param in data) {
        set[param] = data[param];
    }

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
    updateTask: updateTask,
    deleteTask: deleteTask
};