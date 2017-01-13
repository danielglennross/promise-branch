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

  const funcInterceptor = {
    apply: (reciever) => {
      onError = onRejected;
      return reciever();
    }
  };

  const propInterceptor = {
    get: (reciever) => {
      onError = onRejected;
      return reciever.then.bind(reciever);
    }
  };

  const proxyFactory = typeof target === 'function'
    ? () => new Proxy(target, funcInterceptor)()
    : () => new Proxy(target, propInterceptor);

  return proxyFactory().then(onResolved, onError);
};
