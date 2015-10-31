'use strict';

require('mocha');
require('should');
var assert = require('assert');
var move = require('./');

describe('move', function () {
  it('should move a property from object A to object B:', function () {
    var one = {a: 'b'};
    var two = {};
    var actual = move(one, two, 'a');
    assert(!one.a);
    assert(two.a === 'b');
  });

  it('should return object B:', function () {
    var one = {a: 'b'};
    var two = {};
    var actual = move(one, two, 'a');
    assert(actual.a === 'b');
  });

  it('should ignore properties that do not exist:', function () {
    var one = {a: 'b'};
    var two = {};
    var res = move(one, two, 'foo');
    assert.deepEqual(two, res);
  });

  it('should move a nested property:', function () {
    var one = {a: {b: 'c'}};
    var two = {};
    var actual = move(one, two, 'a.b');
    assert(two.a.b === 'c');
    assert(actual.a.b === 'c');
  });

  it('should throw an error when first arg is invalid:', function (cb) {
    try {
      move();
      cb(new Error('expected an error'));
    } catch(err) {
      assert(err);
      assert(err.message);
      assert(err.message === 'expected first argument to be an object');
      cb();
    }
  });

  it('should throw an error when second arg is invalid:', function (cb) {
    try {
      move({});
      cb(new Error('expected an error'));
    } catch(err) {
      assert(err);
      assert(err.message);
      assert(err.message === 'expected second argument to be an object');
      cb();
    }
  });
});

describe('moveProp', function () {
  it('should move property in the given object:', function () {
    var obj = {a: {}, b: {c: 'd'}};
    var actual = move.prop(obj, 'b.c', 'a.c');
    assert(!obj.b.c);
    assert(obj.a.c === 'd');
  });

  it('should return the object:', function () {
    var obj = {a: {}, b: {c: 'd'}};
    var actual = move.prop(obj, 'b.c', 'a.c');
    assert(!actual.b.c);
    assert(actual.a.c === 'd');
  });

  it('should throw an error when first arg is invalid:', function (cb) {
    try {
      move.prop();
      cb(new Error('expected an error'));
    } catch(err) {
      assert(err);
      assert(err.message);
      assert(err.message === 'expected target to be an object');
      cb();
    }
  });
});

describe('moveEach', function () {
  it('should move each property in the given object:', function () {
    var obj = {one: {two: {path: 'a/b.js', src: 'a.js', dest: 'actual'}}, file: {}};
    var fn = move.each(obj)
    fn(['path', 'src', 'dest'], 'one.two', 'file');

    assert(!obj.one.two.path);
    assert(!obj.one.two.src);
    assert(!obj.one.two.dest);
    assert(obj.file.path === 'a/b.js');
    assert(obj.file.src === 'a.js');
    assert(obj.file.dest === 'actual');
  });

  it('should move properties', function () {
    var a = {};
    var b = {path: 'a/b.js', src: 'a.js', dest: 'actual'};
    var fn = move.each(a, b);

    fn(['path', 'dest']);

    assert(!b.path);
    assert(!b.dest);
    assert(a.path === 'a/b.js');
    assert(a.dest === 'actual');
  });

  it('should move properties from a nested object', function () {
    var a = {};
    var b = {one: {two: {path: 'a/b.js', src: 'a.js', dest: 'actual'}}};
    var fn = move.each(a, b);

    fn(['path', 'dest'], 'one.two');

    assert(!b.one.two.path);
    assert(!b.one.two.dest);
    assert(a.path === 'a/b.js');
    assert(a.dest === 'actual');
  });

  it('should move from nested properties to nested properties', function () {
    var a = {};
    var b = {one: {two: {path: 'a/b.js', src: 'a.js', dest: 'actual'}}};
    var fn = move.each(a, b);

    fn(['path', 'dest'], 'one.two', 'file');

    assert(!b.one.two.path);
    assert(!b.one.two.dest);
    assert(a.file.path === 'a/b.js');
    assert(a.file.dest === 'actual');
  });

  it('should move properties from multiple objects', function () {
    var obj = {};
    var fn = move.each(obj, {a: 'aaa'}, {a: 'ccc'}, {b: 'ddd'});

    fn(['a', 'b']);

    assert(obj.a === 'ccc');
    assert(obj.b === 'ddd');
  });

  it('should throw an error when first arg is invalid:', function (cb) {
    try {
      move.each();
      cb(new Error('expected an error'));
    } catch(err) {
      assert(err);
      assert(err.message);
      assert(err.message === 'expected first argument to be an object');
      cb();
    }
  });
});
