# promise-branch
Allows isolated branching of promise flows.

This lib helps to address some of the issues raised by: 
[Broken Promises](https://github.com/cloudflare/cf-ui/blob/6aec707d1efeceda121767b079c1d03a92369fc9/discussions/broken-promises.md)

## Install
`npm install --save promise-branch`

## API

# branch(target, onResolved, onRejected)

`promise-branch` will ensure a rejected promise which occured before branching the flow is ignored and proxied on down the main promise chain.
This means the error handler of `promise-branch` will only handle a rejected promise caused by the target promise/ promise factory.

* target (Promise|Function): a promise or function that returns a promise.
* onResolved (Function): a function that returns a promise. This is called if `target` resolves.
* onRejected (Function): a function that returns a promise. This is called if `target` rejects.

## Example
```javascript
const branch = requires('promise-branch');

initialAsyncWork()
.then(() => 
  branch(
    secondaryAsyncWork(), // this can be a promise, or a function that returns a promise
    successHandler,
    errorHandler // this only handles a rejection from secondaryAsyncWork
  )
)
.then(continuedAsyncWork)
.catch(errorAsyncWork);
```
