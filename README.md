file-loop
=========

Install
-------

`npm install --save file-loop`

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
        yield copy(file.name, path.join('dest', file.name));
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
        //The object has a name field, and a stats field.
        //Here the name field is use to get the name of the current file,
        //and pass that name to the copy function which also returns a promise..
        yield copy(file.name, path.join('dest', file.name));
    }
});
```

API
---

### finder(array) -> promise

Returns a promise that resolves to a function.

The array passed to finder can be one of these string values:

-	file name
-	regular expression
-	glob string

Look at [multimatcher](https://www.npmjs.com/package/multimatcher) for more information.

### find() -> promise

Returns a promise that resolves to an object with the fields `name`, and `stats`.

The `stats` field is the same object you'd get from calling `fs.stat`.

When no there are no more files then the promise resolves to `null` which will stop a loop.

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
        await copy(file.name, path.join('dest', file.name));
    }
}

copyScripts();
```

Happy coding!
