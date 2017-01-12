'use strict';

/**
 * Function allowing isolated branching of promise flows
 *
 * @function
 * @param  {Promise}  promise    The target promise
 * @param  {Function} onResolved Function that handles the target promise's resolve. Must return a promise
 * @param  {Function} onRejected Function that handles the target promise's rejection. Must return a promise
 */
module.exports = (promise, onResolved, onRejected) => {
  let onError = Promise.reject;
  const handler = {
    apply: (reciever, ...args) => {
      onError = onRejected;
      return reciever(args);
    }
  };

  return new Proxy(promise, handler)().then(onResolved, onError);
};
