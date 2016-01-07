file-loop
=========

Install
-------

`npm install --save file-loop`

News
----

`file-loop` now finds directories, sub-directories, and files in those sub-directories.

There is also the new path fields, and root returned by the promise.

Other than that the api is basically the same.

Usage
-----

Copy a bunch of javascript files using [co](https://www.npmjs.com/package/co), and [cpr-omen](https://www.npmjs.com/package/cpr-omen):

```javascript
var finder = require('file-loop'),
    co = require('co'),
    copy = require('cpr-omen'),
    path = require('path');

co(function * (){
    var find = yield finder(['*.js']), file;

    while(file = yield find()){
        yield copy(file.path, path.join('dest', file.name));
    }
});
```

### Understanding the code

```javascript
co(function * (){
    //Calling finder returns a promise that resolves to a function
    //which is assigned to the variable find.
    var find = yield finder(['*.js']),
        file;

    //Calling find returns a promise that resolves to an object.
    while(file = yield find()){
        //The fields
        //file.name = the file name
        //file.path = the full path of the file
        //file.stats = the stats for the file
        //file.root = the cwd of the file
        yield copy(file.path, path.join('dest', file.name));
    }
});
```

Though these examples don't show it the lib `co` returns a promise.

API
---

### finder(array, options) -> promise

Returns a promise that resolves to a function.

The array passed to finder can be one of these string values:

-	file name
-	regular expression
-	glob string

### options

Options should be an object with these fields:

#### options.ignore = Array

An array of files to not include in the set of found files. These are the same value types as the first argument to the `finder` function.

#### options.cwd = String

The directory to **find** files in. The default is `process.cwd`.

Look at [multimatcher](https://www.npmjs.com/package/multimatcher) for more information.

### find() -> promise

Returns a promise that resolves to an object with these fields.

-	file.name = the basename of the file
-	file.path = the full path of the file
-	file.stats = the stats for the file
-	file.root = the cwd of the file

When there are no more files then the promise resolves to `null` which will stop a loop.

Possible Usage
--------------

If **async/await** is an option available to you then you can do this:

```javascript
var finder = require('file-loop'),
    co = require('co'),
    copy = require('cpr-omen'),
    path = require('path');

async function copyScripts (){
    let find = await finder(['*.js']);

    while(let file = await find()){
        await copy(file.path, path.join('dest', file.name));
    }
}

copyScripts();
```

Happy coding!
