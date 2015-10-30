/*!
 * move-property <https://github.com/jonschlinkert/move-property>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var utils = require('./utils');

/**
 * Move `prop` from object `a` to object `b`.
 *
 * @param {Object} `prop`
 * @param {String} `a`
 * @param {String} `b`
 * @return {Object}
 */

module.exports = function move(a, b, prop, key) {
  if (!utils.isObject(a)) {
    throw new Error('expected first argument to be an object');
  }
  if (!utils.isObject(b)) {
    throw new Error('expected second argument to be an object');
  }
  var val = utils.get(a, prop);
  utils.set(b, key || prop, val);
  utils.del(a, prop);
  return b;
};

module.exports.prop = function moveProp(target, a, b) {
  if (!utils.isObject(target)) {
    throw new Error('expected target to be an object');
  }
  var val = utils.get(target, a);
  utils.set(target, b, val);
  utils.del(target, a);
  return target;
};

module.exports.each = function moveEach(target, keys, a, b) {
  if (!utils.isObject(target)) {
    throw new Error('expected target to be an object');
  }
  keys.forEach(function (key) {
    var val = utils.get(target, a + '.' + key);
    utils.set(target, b + '.' + key, val);
    utils.del(target, a + '.' + key);
  });
  return target;
};
