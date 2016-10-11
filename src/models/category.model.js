var mongoose = require('mongoose');

var categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    slug: {
        type: String,
        slug: 'name'
    },
    create_date: {
        type: Date,
        default: Date.now
    }
});

function getCategories(user, callback, limit) {
    var query = {user: user._id};
    Category.find(query, callback).limit(limit);
}

function getCategory(id, user, callback) {
    var query = {_id: id, user: user._id};
    Category.findOne(query, callback);
}

function createCategory(data, user, callback) {
    data.user = user._id;
    Category.create(data, callback);
}

function updateCategory(id, data, user, callback) {
    var set = {};
    for (var param in data) {
        set[param] = data[param];
    }

    Category.findOneAndUpdate({_id: id, user: user._id}, { $set: set }, { new: true }, callback);
}

function deleteCategory(id, user, callback) {
    var query = {_id: id, user: user._id};
    Category.remove(query, callback);
}

var Category = module.exports = mongoose.model('Category', categorySchema);

module.exports = {
    getCategories: getCategories,
    getCategory: getCategory,
    createCategory: createCategory,
    updateCategory: updateCategory,
    deleteCategory: deleteCategory
};