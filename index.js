var Multimatcher = require('multimatcher'),
    fs = require('fs'),
    path = require('path');

/*
git remote add origin https://github.com/hollowdoor/file_loop.git
git push -u origin master
*/

module.exports = function(list, options){
    options = options || {};
    var cwd = process.cwd(),
        ignore = null,
        files = [],
        matcher = new Multimatcher(list);

    if(typeof options.cwd === 'string'){
        cwd = options.cwd;
    }

    if(Object.prototype.toString.call(options.ignore) === '[object Array]'){
        ignore = new Multimatcher(options.ignore);
    }

    return readdir(cwd).then(function(_files){
        if(_files.length && ignore){
            _files = _files.filter(filterIgnore(ignore));
        }
        files = _files;
        return next;
    });

    function next(){
        if(!files.length){
            return Promise.resolve(null);
        }
        var current = files.shift();
        if(matcher.test(current)){
            return foundMatch(current);
        }

        return thenStat(current);
    }

    function thenStat(name){
        var fullPath = path.join(cwd, name);
        return stat(fullPath).then(function(stats){
            if(stats.isDirectory()){
                return thenReaddir(fullPath, name);
            }
            return next();
        });
    }

    function thenReaddir(fullPath, parent){
        return readdir(fullPath).then(function(_files){
            if(!_files.length) return;
            _files = _files.map(joinPaths(parent));

            if(ignore){
                _files = _files.filter(filterIgnore(ignore));
                if(!_files.length) return;
            }
            files = _files.concat(files);
        }).then(next);
    }

    function foundMatch(name){
        var fullPath = path.join(cwd, name);
        return stat(fullPath).then(function(stats){

            return {
                name: path.basename(name),
                path: fullPath,
                fullPath: fullPath,
                stats: stats,
                root: cwd
            };
        });
    }

};

function stat(name){
    return new Promise(function(resolve, reject){
        fs.lstat(name, function(err, stats){
            if(err) return reject(err);
            resolve(stats);
        });
    });
}

function readdir(name){
    return new Promise(function(resolve, reject){
        fs.readdir(name, function(err, files){
            if(err) return reject(err);
            resolve(files);
        });
    });
}

function joinPaths(parent){
    return function(file){
        return path.join(parent, file);
    };
}

function filterIgnore(ignore){
    return function(file){
        return !ignore.test(file);
    };
}
