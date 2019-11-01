# Scientist!

[![npm version](https://badge.fury.io/js/%40gustavnikolaj%2Fscientist.svg)](https://www.npmjs.com/package/@gustavnikolaj/scientist)

A javascript library for carefully refactoring critical paths. Inspired by [github/scientist](https://github.com/github/scientist).

```
$ npm install @gustavnikolaj/scientist
```

## Quick start

```js
const scientist = require("scientist");

function controlImplementationAdd2(x) {
  // This is the existing code path. The return value from this function will
  // be the one that is returned to the caller.

  return x + 2;
}

function experimentImplementationAdd2(x) {
  // This is your new experiment that you want to test

  return x * 2;
}

// By default the function returned from calling scientist will write output to
// stdout / stderr using console. You can provide a console-compatible object
// as an optional third argument: scientist(x, y, myConsole);
const add2 = scientist(controlImplementationAdd2, experimentImplementationAdd2);

add2(2);
// Passed: Both functions returned the same. { args: [ 2 ],
//                                             control: { return: 4 },
//                                             experiment: { return: 4 } }

add2(4);
// Failed: Experiment returned different value. { args: [ 4 ],
//                                                control: { return: 6 },
//                                                experiment: { return: 8 } }
```

## More control

You can handle reporting yourself by using a lower level interface.

```js
const { Experiment } = require("./");

function myScientist(
  controlImplementation,
  experimentImplementation,
  logger = console
) {
  const experiment = new Experiment(
    experimentImplementation,
    controlImplementation
  );

  experiment.handleReport = report => {
    // Do whatever you want with the report. This function is called whenever
    // your experiment has run.
  };

  return (...args) => experiment.run(...args);
}
```
