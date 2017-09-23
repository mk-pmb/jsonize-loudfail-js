/*jslint indent: 2, maxlen: 80, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

require('usnam-pmb');
var equal = require('equal-pmb');

(function readmeDemo() {
  //#u
  var jsonizeLoudfail = require('jsonize-loudfail'), data;

  data = [ 42, 23, 5 ];
  function toJSON() { return jsonizeLoudfail(data, null, 2); }
  equal(toJSON(), '[\n  42,\n  23,\n  5\n]');

  data.foo = true;
  data['011'] = 11;
  equal.err(toJSON, 'Error: Un-JSON-able array properties: "foo", "011"');

  data = {};
  equal(toJSON(), '{}');
  data.foo = toJSON;
  equal.err(toJSON,
    'Error: Slot "foo": Un-JSON-able function: function toJSON() {…}');
  data.foo = undefined;
  equal.err(toJSON, 'Error: Slot "foo": Un-JSON-able undefined');

  data = Object.create(null);
  data.foo = 23;
  equal(toJSON(), '{\n  "foo": 23\n}');

  data = new Date(0);
  equal.err(toJSON, 'Error: Date would be converted to string');
  data = { epoch: new Date(0) };
  equal.err(toJSON, 'Error: Slot "epoch": Date would be converted to string');

  data = { rgx: /$/g };
  equal.err(toJSON, 'Error: Slot "rgx": Un-JSON-able {RegExp}: /$/g');
  //#r
}());









console.log("+OK usage test passed.");    //= "+OK usage test passed."
