## EcmaScript 6 Modules And Module Support

Note: This content is subject to change and may be removed prior to launch.

Yeoman comes with experimental support for ES6 modules, made possible through Require HM. HM allows us to write ES.next module syntax and as long as code is saved in files with `.hm` extension, they can be used with RequireJS and AMD as if they were regular ES3/5 scripts.


*Note: The ES.next module specification is not yet complete and is subject to change. As such, the material below should be considered correct as of June, 2012 but for later dates the Harmony wiki entry on modules should be consulted to ensure correctness.

Also note that as Require HM is a RequireJS plugin, ES6 modules are only supported when used with RequireJS. We hope to change this in the future once support for ES6 modules in Google Traceur has improved.*

###module:

In ES6, A module is a unit of code contained within a `module` declaration. It can either be defined inline or within an externally loaded module file. A skeleton inline module for a Car could be written:

```javascript
module Car{
  // import …
  // export …
}
```
When we say *externally loaded modules*, we are referring to modules which are either loaded using `import` declarations or the Module Loader API. Both will be covered shortly.

A module *instance* is a module which has been evaluated, is linked to other modules or has lexically encapsulated data. Examples of modules instances are:

```javascript
module myCar = Car;
module myCar at "car.js";
```

`module` declarations can be used in the following contexts:

```javascript
module Universe {}
module Universe { module MilkyWay {} }
module MilkyWay = "Universe/MilkyWay"
module System = Universe.MilkyWay.SolarSystem
module System = SolarSystem

```

###export:

An export declaration declares that a local function or variable binding is visible externally to other modules. If familiar with the module pattern, think of this concept as being parallel to the idea of exposing functionality publicly.

```javascript
module Car{

  // Internals
  var licensePlateNo = "556-343"

  // Exports
  export function drive(speed, direction){
    console.log('We are driving at a speed of ' + speed + ', ' + direction);
  }

  export var miles = 5000;
  export var color = "silver";
}

```

Modules `import` what they wish to use from other modules. Other modules may read the module exports (e.g `drive()`, `miles` etc. above) but they cannot modify them. Exports can be renamed as well so their names are different from local names.

A module may also export other modules for consumption.

```javascript
module Car{
  export module engine{}
  export module driver{}
  export module seats{}
}
```

`export` can be used in the following contexts:

```javascript
export var document
export var document = { }
export function parse() { }
export module System = SolarSystem
export SolarSystem
export Mercury, Venus, Earth
export * from SolarSystem
export { Mercury: SolarSystem.Mercury, Earth: SolarSystem.Earth }
```


###import:

An import declaraction binds another modules exports as local variables. Variables that are imported can be locally renamed to avoid naming conflicts.

```javascript
module Car{
  export function drive(speed, direction){
    console.log('details:', speed, direction);
  }

  export module engine{
    export function check(){ ... }
  }

  export var miles = 5000;
  export var color = "silver";

};
```

Revisiting the export example above, we can now selectively choose what we wish to `import` when in another module.

We can just import `drive()`:

```javascript
import drive from Car;
```

We can import `drive()` and `miles`:

```javascript
import {drive, miles} from Car;
```

We can import `check()` from our engine module:

```javascript
import check from Car.engine;
```

We can import all of the exports:

```javascript
import * from Car;
```

We can also import an entire file as a module:

```javascript
import "car.js" as Car;
```

Or import `drive()` without needing to bind the module to a local name:

```javascript
import drive from "car.js";
```

This similarly works with JavaScript libraries like Underscore.js:

```javascript
import reduce from "Underscore.js"
```


### module, import and export

Bringing these three concepts together:


```javascript
module vehicle{
  export function drive(speed, direction){
    console.log('We are driving at a speed of ' + speed + ', ' + direction);
  };

  export function stop(){
    console.log('We have stopped');
  };

  export var miles = 0;
  export var color = "silver";
  export var wheels = 4;
}

module basicExtras{
  export var carSeat = true;
  export var specialRims =  true;
  export var mp3Player = true;
}

module premiumExtras{
  export module GPS{
    //...
  }
}

```

```javascript
// Engine.js
module engine{

}
```

```javascript
module Car{
  import * from vehicle;
  import {specialRims, mp3Player} from basicExtras;
  import "engine.js" as engine;
  module navigationSystem from premiumExtras.GPS;

  export drive;
  export stop;
}
```

-- how do you rename exports?



### dynamically loading modules

Earlier, we mentioned the concept of a Module Loader API. The module loader allows us to dynamically load in scripts for consumption. Similar to `import`, we are able to consume anything defined as an `export` from such modules.

```javascript
// Signature: load( moduleURL, callback, errorCallback )

Loader.load("car.js", function(car) {
        console.log(car.drive(500, "north"));
    }, function(err){
        console.log("Error:" + err);
    });

```

`load()` accepts three arguments:

* moduleURL: The string representing a module URL (e.g "car.js")
* callback: A callback function which receives the output result of attempting to load, compile and then execute the module
* errorCallback: A callback triggered if an error occurs during loading or compilation

Whilst the above example seems fairly trivial to use, the Loader API is there to provide a way to load modules in controlled contexts and actually supports a number of different configuration options. `Loader` itself is a system provided instance of the API, but it's possible to create custom loaders using the `Loader` constructor.


```javascript
// The Loader constructor creates a new loader
var customLoader = new Loader(
    // Define the parent of this loader
    // if a custo one exists, otherwise
    // just use the default system Loader
    Loader, {

    // Global object for the Loader
    global: Object.create(null),

    // Loader's base URL
    baseURL: baseURL,

    // A flag indicating whether code should be evaluated
    // in strict mode
    strict: false,

    // Source of the loader intrinsics which can either
    // be an existing loader or just null
    linkedTo: Loader || null,

    // The module resolution hook
    resolve: function( relativeURL, baseURL ){..},

    // The module loading hook
    fetch: function( relativeURL, baseURL, request, resolved ){…},

    // A hook for source translation
    translate: function( src, relativeURL, baseURL, resolved ){…}
});
```


Let's review the final three hooks in more detail:

**fetch: function( relativeURL, baseURL, request, resolved ):**

Once a module is resolved, it must be fetched. The `fetch` hook allows us to fetch code from an external resource and returns its source via the first callback or rejecting the code via the second callback.


The `fetch` request object has three callbacks:

```javascript
request = {

  // callbacks for the loading hook

  // callback to create the successfully loaded source
  fulfill: function( src ){..},

  // callback to indicate the source should be loaded from a different URL
  redirect: function( url, baseURL ){..}

  // callback to indicate am error occurred in the loading
  reject: function( msg )
}
```

If we don't supply a `fetch` hook, the parent Loader's `fetch` is used instead.



**resolve: function( relativeURL, baseURL ):**



**translate: function( src, relativeURL, baseURL, resolved ):**

When code is evaluated, we have the option of translating the source of that code using this hook. The hook can either produce the final source code or throw an exception if something goes wrong.


A complete custom loader example could thus be written as follows:

```javascript
var customLoader = new Loader(Loader,{
    global: window,
    baseURL: document.URL.substring(0, document.URL.lastIndexOf('\/') + 1),
    strict: false,
    resolve: function (relURL, baseURL) {
      var url = baseURL + relURL;
      return url;
    },
    fetch: function (relURL, baseURL, request, resolved) {
      var url = baseURL + relURL;
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            request.fulfill(xhr.responseText);
          } else {
            request.reject(xhr.statusText);
          }
        }
      };
      xhr.open("GET", url, true);
      xhr.send(null);
    },
    translate: function (src, relURL, baseURL, resolved) {
      return src;
    }
  });
```


*Note: As Require HM is able to work with the RequireJS `define()` and `require()` syntax, it doesn't currently support the Module Loader API. If one is however required, there is a shim available for this feature [here](https://github.com/addyosmani/es6-module-loader/).*


### What else can be done with modules?

We can also define modules with a shared state:

```javascript
module Car{
  export module milesCounter {
      var miles = 0;
      export function addMile() { return miles++ }
      export function currentMiles() { return miles }
  };
};
```

or cyclic dependencies:

```javascript
module Car {
    import * from Scooter;
    export function even(n) {
        return n == 0 || odd(n - 1);
    }
}

module Scooter {
    import * from Car;
    export function odd(n) {
        return n != 0 && even(n - 1);
    }
}
```


*Note: Require HM does not presently support cyclic dependencies. We are working on fixing this limitation.*




