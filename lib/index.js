'use strict';

/**
 * Function allowing isolated branching of promise flows
 *
 * @function
 * @param  {Promise|Function} target     A promise or function that returns a promise
 * @param  {Function}         onResolved Function that handles the target promise's resolve. Must return a promise
 * @param  {Function}         onRejected Function that handles the target promise's rejection. Must return a promise
 */
module.exports = (target, onResolved, onRejected) => {
  let onError = Promise.reject;

  const interceptor = {
    apply: (receiver) => {
      onError = onRejected;
      return receiver();
    },
    get: (receiver) => {
      onError = onRejected;
      return receiver.then.bind(receiver);
    }
  };

  const proxy = new Proxy(target, interceptor);
  const promise = typeof target === 'function' ? proxy() : proxy;

  return promise.then(onResolved, onError);
};
