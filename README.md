# Jasmine Node Test Adapter

A Visual Studio test explorer adapter for running [Jasmine](http://jasmine.github.io/) specs in [Node.js](https://nodejs.org/)

This extension integrates [Jasmine](http://jasmine.github.io/) with the test explorer in Visual Studio 2013 and Visual Studio 2015 Preview / CTP.

This extension is built using [JsTestAdapter](https://github.com/MortenHoustonLudvigsen/JsTestAdapter).

This test adapter runs tests in [Node.js](https://nodejs.org/). If you need to run tests in browsers you might be interested in the [Karma Test Adapter](https://github.com/MortenHoustonLudvigsen/KarmaTestAdapter).

# Features

* All tests get run as soon as a test or source file is saved and the results are shown in the Test Explorer. There is no need to click `Run All` in the Test Explorer.

* The file and position of each test is registered, so that the Test Explorer in Visual Studio can link to the source code for the test.

* Source maps in test files are used to find the position of tests. So if, for example, a test is written in Typescript and the compiled JavaScript file contains a source map the test explorer will link to the typescript file.

* The stack trace of a failed test is shown as a list of function names that link to the relevant line and file. As with the position of of tests, source maps are used to link to the original source.

* Any output from a test (f.ex. using `console.log`) will be shown in the test result in the Test Explorer as a link: `Output`.

# Prerequisites

* Install [NodeJS](http://nodejs.org/)

* Install [Jasmine](http://jasmine.github.io/) in your project:  
  ```
  npm install jasmine --save-dev
  ```

# Installation

Download and install from the Visual Studio Gallery here: [Jasmine Node Test Adapter](http://visualstudiogallery.msdn.microsoft.com/...)

# Configuration

The Jasmine Node Test Adapter is configured by adding a file to a project called `JasmineNodeTestAdapter.json`.

Example:


````JSON
{
    "$schema": "http://MortenHoustonLudvigsen.github.io/JasmineNodeTestAdapter/JasmineNodeTestAdapter.schema.json",
    "Name": "My tests",
    "BasePath": ".",
    "Helpers": [ "specs/**/*[Hh]elper.js" ],
    "Specs": [ "specs/**/*[Ss]pec.js" ],
    "Watch": [ "src/**/*.js" ],
    "BatchInterval": 250,
    "Extensions": "./Extensions",
    "Traits": [ "Jasmine", { "Name": "Foo", "Value": "Bar" } ],
    "Disabled": false,
    "LogToFile": true,
    "LogDirectory": "TestResults/JasmineTestAdapter"
}
````   

These are the possible properties (all properties are optional):

* `$schema` Set to "<http://MortenHoustonLudvigsen.github.io/JasmineNodeTestAdapter/JasmineNodeTestAdapter.schema.json>" to get
  intellisense for `JasmineNodeTestAdapter.json`.

* `Name` The name of the test container. Used in the default generation of the fully qualified name for each test.

* `BasePath` The base path to use to resolve file paths. Defaults to the directory in which `JasmineNodeTestAdapter.json` resides.

* `Helpers` Non-source, non-spec helper files. Loaded before any specs. Wildcards can be used - see [glob](https://www.npmjs.com/package/glob).

* `Specs` Files containing Jasmine specs. Wildcards can be used - see [glob](https://www.npmjs.com/package/glob).

* `Watch` A test run is triggered if any file specified in `Helpers` or `Specs` change. Add any files in `Watch` that should also trigger a test run when they change. These will typically be the source files. Wildcards can be used - see [glob](https://www.npmjs.com/package/glob).

* `BatchInterval` When the test adapter is watching files for changes, it will wait `BatchInterval` ms before running tests. Default value is 250.

* `Traits` An array of traits to be attached to each test. A trait can be a string or an object containing properties `Name` and `Value`. A trait specified as a string or with only a name will be shown in the Test Explorer as just the string or name.

* `Extensions` Path to a node.js module implementing extensions.

* `Disabled` Set to true, if the test adapter should be disabled for this configuration file.

* `LogToFile` Set to true, if you want the adapter to write log statements to a log file (named JasmineNodeTestAdapter.log).

* `LogDirectory` Where the log file should be saved (if LogToFile is true). If this property is not specified the directory in which JasmineNodeTestAdapter.json resides is used.

`JasmineNodeTestAdapter.json` must be encoded in one of the following encodings:

* UTF-8
* UTF-8 with BOM / Signature
* UTF-16 Big-Endian with BOM / Signature
* UTF-16 Little-Endian with BOM / Signature

# Extensions

To customize generation of fully qualified names, display names and traits for each test it is now possible to supply a node module with extensions. An extensions module can implement any or all of these functions:

* `getDisplayName` Generate the display name of a test.

* `getFullyQualifiedName` Generate the fully qualified name of a test. This must be unique for the test adapter to work properly. The class name for a test is generated from the inner most part of the fully qualified name separated by full stops.

* `getTraits` Specify traits for a test. Any traits specified in `JasmineNodeTestAdapter.json` will be in `spec.traits`.

The following module implemented in typescript implements the default functions:

````JavaScript
interface Spec {
    description: string;
    suite: string[];
    traits: Trait[];
}

interface Server {
    testContainerName: string;
}

interface Trait {
    name: string;
    value: string;
}

export function getDisplayName(spec: Spec, server: Server): string {
    var parts = spec.suite.slice(0);
    parts.push(spec.description);
    return parts
        .filter(p => !!p)
        .join(' ');
}

export function getFullyQualifiedName(spec: Spec, server: Server): string {
    var parts = [];
    if (server.testContainerName) {
        parts.push(server.testContainerName);
    }
    var suite = spec.suite.slice(0);
    parts.push(suite.shift());
    suite.push(spec.description);
    parts.push(suite.join(' '));
    return parts
        .filter(p => !!p)
        .map(s => s.replace(/\./g, '-'))
        .join('.');
}

export function getTraits(spec: Spec, server: Server): Trait[] {
    return [];
}
````

The same module implemented in JavaScript:

````JavaScript
exports.getDisplayName = function (spec, server) {
    var parts = spec.suite.slice(0);
    parts.push(spec.description);
    return parts.filter(function (p) { return !!p; }).join(' ');
};

exports.getFullyQualifiedName = function (spec, server) {
    var parts = [];
    if (server.testContainerName) {
        parts.push(server.testContainerName);
    }
    var suite = spec.suite.slice(0);
    parts.push(suite.shift());
    suite.push(spec.description);
    parts.push(suite.join(' '));
    return parts.
        filter(function (p) { return !!p; }).
        map(function (s) { return s.replace(/\./g, '-'); }).
        join('.');
};

exports.getTraits = function (spec, server) {
    return [];
};
````

## Example: `getDisplayName`

Let's say the suites for a project represent classes and methods. In this case one might want the suites to be displayed separated by full stops. This can be implemented in an extension module.

Typescript:

````JavaScript
export function getDisplayName(spec: Spec, server: Server): string {
    return spec.suite.join('.') + ' ' + spec.description;
}
````

JavaScript:

````JavaScript
exports.getDisplayName = function (spec, server) {
    return spec.suite.join('.') + ' ' + spec.description;
};
````

## Example: `getFullyQualifiedName`

Let's say the suites for a project represent classes and methods. In the class view the test explorer displays tests sorted by the inner most class name of the fully qualified name (as it would look in C#). If we want to show the full name of the classes in our project we can implement this in an extension module.

Typescript:

````JavaScript
export function getFullyQualifiedName(spec: Spec, server: Server): string {
    var parts = [];

    // Add server.testContainerName to ensure uniqueness
    if (server.testContainerName) {
        parts.push(server.testContainerName);
    }

    // To ensure that the test explorer sees all suites as one identifier, we
    // separate suites with '-', not '.'
    parts.push(spec.suite.join('-'));

    // Add the test description
    parts.push(spec.description);

    // The fully qualified name is the parts separated by '.'. We make sure that
    // the parts do not contain '.', as this would confuse the test explorer
    return parts
        .map(s => s.replace(/\./g, '-'))
        .join('.');
}
````

JavaScript:

````JavaScript
exports.getFullyQualifiedName = function (spec, server) {
    var parts = [];

    // Add server.testContainerName to ensure uniqueness
    if (server.testContainerName) {
        parts.push(server.testContainerName);
    }

    // To ensure that the test explorer sees all suites as one identifier, we
    // separate suites with '-', not '.'
    parts.push(spec.suite.join('-'));

    // Add the test description
    parts.push(spec.description);

    // The fully qualified name is the parts separated by '.'. We make sure that
    // the parts do not contain '.', as this would confuse the test explorer
    return parts.map(function (s) { return s.replace(/\./g, '-'); }).join('.');
};
````

## Example: `getTraits`

Let's say we want to add the outer most suite as a trait for each test, while keeping any traits specified in `JasmineNodeTestAdapter.json`. We can implement this in an extension module.

Typescript:

````JavaScript
export function getTraits(spec: Spec, server: Server): Trait[]{
    var traits = spec.traits;
    var outerSuite = spec.suite[0];
    if (outerSuite) {
        traits.push({
            name: 'Suite',
            value: outerSuite
        });
    }
    return traits;
}
````

JavaScript:

````JavaScript
exports.getTraits = function (spec, server) {
    var traits = spec.traits;
    var outerSuite = spec.suite[0];
    if (outerSuite) {
        traits.push({
            name: 'Suite',
            value: outerSuite
        });
    }
    return traits;
};
````

If we do not want to keep any traits specified in `JasmineNodeTestAdapter.json`, we can simply ignore the existing traits.

Typescript:

````JavaScript
export function getTraits(spec: Spec, server: Server): Trait[]{
    var traits: Trait[] = [];
    var outerSuite = spec.suite[0];
    if (outerSuite) {
        traits.push({
            name: 'Suite',
            value: outerSuite
        });
    }
    return traits;
}
````

JavaScript:

````JavaScript
exports.getTraits = function (spec, server) {
    var traits = [];
    var outerSuite = spec.suite[0];
    if (outerSuite) {
        traits.push({
            name: 'Suite',
            value: outerSuite
        });
    }
    return traits;
};
````

