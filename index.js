var Multimatcher = require('multimatcher'),
    fs = require('fs');

/*
git remote add origin https://github.com/hollowdoor/file_loop.git
git push -u origin master
*/

module.exports = function(list, options){
    options = options || {};
    var dir = process.cwd(), ignore = null;
    if(typeof options.cwd === 'string'){
        dir = options.cwd;
    }

    if(Object.prototype.toString.call(options.ignore) === '[object Array]'){
        ignore = new Multimatcher(options.ignore);
    }

    return new Promise(function(resolve, reject){
        var files, found,
            index = -1,
            matcher = new Multimatcher(list);

        fs.readdir(dir, function(err, files){
            if(err){
                return reject(err);
            }

            found = matcher.find(files);

            function getFileInfo(){
                if(++index >= found.length){
                    return Promise.resolve(null);
                }

                var name = found[index];

                if(ignore && ignore.test(name)){
                    return getFileInfo();
                }

                return new Promise(function(resolve, reject){
                    fs.lstat(name, function(stats){
                        resolve({name: name, stats: stats});
                    });

                });
            }

            resolve(getFileInfo);
        });
    });
};
