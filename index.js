var Multimatcher = require('multimatcher'),
    fs = require('fs');

/*
git remote add origin https://github.com/hollowdoor/file_loop.git
git push -u origin master
*/

module.exports = function(list, cwd){
    if(typeof dir !== 'string'){
        dir = process.cwd();
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

            resolve(function(){
                if(++index === found.length){
                    return Promise.resolve(null);
                }
                var name = found[index];
                return new Promise(function(resolve, reject){
                    fs.lstat(name, function(stats){
                        resolve({name: name, stats: stats});
                    });

                });
            });
        });
    });
};
