'use strict'

const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;

const branch = require('../lib');

describe('promise branch', () => {

  it('should allow a promise to be passed as the target', done => {
    branch(Promise.resolve(),
      () => Promise.resolve('targetResolved'),
      () => Promise.resolve('targetRejected')
    )
    .then(data => {
      expect(data).to.equal('targetResolved');
      done();
    });
  });

  it('should allow a promise factory to be passed as the target', done => {
    branch(() => Promise.resolve(),
      () => Promise.resolve('targetResolved'),
      () => Promise.resolve('targetRejected')
    )
    .then(data => {
      expect(data).to.equal('targetResolved');
      done();
    });
  });

  it('should not handle any existing rejected promises', done => {
    Promise.reject(new Error('existing'))
    .then(() => branch(Promise.resolve(),
      () => Promise.resolve('targetResolved'),
      () => Promise.resolve('targetRejected')
    ))
    .catch(err => {
      expect(err.message).to.equal('existing');
      done();
    });
  });

  it('should call onResolved handler on a resolved target', done => {
    Promise.resolve()
    .then(() => branch(Promise.resolve(),
      () => Promise.resolve('targetResolved'),
      () => Promise.resolve('targetRejected')
    ))
    .then(data => {
      expect(data).to.equal('targetResolved');
      done();
    });
  });

  it('should call onRejected handler on a rejected target', done => {
    Promise.resolve()
    .then(() => branch(Promise.reject('branchError'),
      () => Promise.resolve('targetResolved'),
      () => Promise.resolve('targetRejected')
    ))
    .then(data => {
      expect(data).to.equal('targetRejected');
      done();
    });
  });

  it('should not handle error in down chain catch on a rejected target', done => {
    Promise.resolve()
    .then(() => branch(Promise.reject('branchError'),
      () => Promise.resolve('targetResolved'),
      () => Promise.resolve('targetRejected')
    ))
    .catch(err => {
      assert(false);
    })
    .then(data => {
      assert(true);
      done();
    });
  });

  it('should allow a rejected promise to be handled down chain on a rejected onResolved handler', done => {
    Promise.resolve()
    .then(() => branch(Promise.resolve(),
      () => Promise.reject(new Error('oops')),
      () => Promise.resolve()
    ))
    .catch(err => {
      expect(err.message).to.equal('oops');
      done();
    });
  });

  it('should allow a rejected promise to be handled down chain on a rejected onRejected handler', done => {
    Promise.resolve()
    .then(() => branch(Promise.reject(),
      () => Promise.resolve(),
      () => Promise.reject(new Error('oops'))
    ))
    .catch(err => {
      expect(err.message).to.equal('oops');
      done();
    });
  });
});
