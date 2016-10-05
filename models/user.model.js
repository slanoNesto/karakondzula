var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    first_name: {
        type: String,
        default: ''
    },
    last_name: {
        type: String,
        default: ''
    },
    create_date: {
        type: Date,
        default: Date.now
    }
});

function getUsers(callback, limit) {
    User.find(callback).limit(limit);
}

function getUser(query, callback) {
    User.findOne(query, callback);
}

function createUser(data, callback) {
    User.create(data, callback);
}

//removing password from response (instead calling res.json(user), now is res.send(user.toJSON()))
userSchema.methods.toJSON = function () {
    var user = this.toObject();
    delete user.password;

    return user;
};

userSchema.methods.comparePasswords = function (password, callback) {
    bcrypt.compare(password, this.password, callback);
};

var User = module.exports = mongoose.model('User', userSchema);

//crypting the password
userSchema.pre('save', function(next) {
    var user = this;

    if (!user.isModified('password')) return next();
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});

module.exports = {
    getUsers: getUsers,
    getUser: getUser,
    createUser: createUser
};