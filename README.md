# promise-branch
Allows isolated branching of promise flows.

## Install
`npm install --save promise-branch`

## Getting started
```javascript
const branch = requires('promise-branch');

// onResolved and onRejected are functions that return a promise
branch(targetPromise, onResolved, onRejected);
```

`promise-branch` will ensure a rejected promise which occured before branching the flow is ignored and proxied on down the main promise chain.
This means the error handler of `promise-branch` will only handle a rejected promise caused by the target promise.


## Example
```javascript
const branch = requires('promise-branch');

initialAsyncWork()
.then(() => branch(secondaryAsyncWork(),
  successHandler,
  errorHandler // this only handles a rejection from secondaryAsyncWork
))
.then(continuedAsyncWork)
.catch(errorAsyncWork);
```
