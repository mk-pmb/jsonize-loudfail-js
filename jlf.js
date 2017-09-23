/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

function n0t(f) { return function () { return !f.apply(this, arguments); }; }
function ifLen(x) { return (x && x.length && x); }
function strq(x) { return JSON.stringify(x); }  // discard extra args

var EX = {}, obj2str = Object.prototype.toString, isAry = Array.isArray,
  getProto = Object.getPrototypeOf, pojoProto = Object.prototype;


EX = function (x, s, i) {
  if (s === +s) {
    i = s;
    s = null;
  }
  var e = EX.shallowWhyNot(x, 0);
  // ^-- we need this extra check to detect x instanceof Date
  if (e) { throw new Error(e); }
  return JSON.stringify(x, EX.chain(s), i);
};


EX.chain = function (s) {
  return function (k, v) {
    if (s) {
      v = s(k, v);
      if (v === undefined) { return v; }
    }
    var w = EX.shallowWhyNot(v, 1);
    if (w) { throw new Error(EX.prefixKey(k, w)); }
    return v;
  };
};


EX.prefixKey = function (k, w) {
  if (k === '') { return w; }
  // ^-- NB: Node.js v6.11.3 gives array indices as numbers,
  //         while in Firefox 55 they're strings.
  return ('Slot ' + strq(k) + ': ' + w);
};


EX.shallowWhyNot = function (v, maxDive) {
  if (v === null) { return; }
  maxDive = (+maxDive || 0);
  var t = typeof v, p;
  if (t === 'string') { return; }
  if (t === 'boolean') { return; }
  if ((t === 'number') && (v === +v)) { return; }
  if (t === 'object') {
    if (isAry(v)) {
      t = EX.extraArrayProps(v);
      if (!t) {
        if (Object.keys(v).length !== v.length) {
          return 'Un-JSON-able sparse array';
        }
        if (!maxDive) { return; }
        return EX.shallowWhyNot_scanContainer(v);
      }
      v = t.map(strq).join(', ');
      t = 'array propert' + (t.length === 1 ? 'y' : 'ies');
    } else {
      p = getProto(v);
      if ((p === pojoProto) || (p === null)) {
        if (!maxDive) { return; }
        return EX.shallowWhyNot_scanContainer(v);
      }
      t = obj2str.call(v).slice(8, -1);
      p = EX.typeProblem[t];
      if (p) { return t + ' ' + p; }
      t = '{' + t + '}';
    }
  }
  if (t === 'function') { v = String(v).split(/\s*(\n|\{)/)[0] + ' {…}'; }
  t = 'Un-JSON-able ' + t;
  if (v) { t += ': ' + String(v); }
  return t;
};


EX.typeProblem = {
  Date: 'would be converted to string',
};


EX.shallowWhyNot_scanContainer = function (c) {
  var e;
  Object.keys(c).some(function (k) {
    e = EX.shallowWhyNot(c[k], 0);
    if (!e) { return; }
    e = EX.prefixKey(k, e);
    return true;
  });
  return e;
};


EX.extraArrayProps = function (arr) {
  return ifLen(Object.keys(arr).filter(n0t(EX.isPlainIntStr)));
};


EX.isPlainIntStr = function (x) { return ((+x).toFixed(0) === x); };











module.exports = EX;
