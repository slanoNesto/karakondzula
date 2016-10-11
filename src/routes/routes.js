var fs = require('fs');

module.exports = function (app) {

    //going through all the files in directory and including them (except routes.js)
    fs.readdirSync(__dirname).forEach(function(file) {
        if (file === "routes.js" || file.substr(file.lastIndexOf('.') + 1) !== 'js')
            return;
        var name = file.substr(0, file.indexOf('.js'));
        require('./' + name)(app);
    });

};