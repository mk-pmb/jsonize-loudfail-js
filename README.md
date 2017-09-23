
<!--#echo json="package.json" key="name" underline="=" -->
jsonize-loudfail
================
<!--/#echo -->

<!--#echo json="package.json" key="description" -->
A serializer for JSON.stringify that throws in case of data loss.
<!--/#echo -->


Usage
-----

from [test.usage.js](test.usage.js):

<!--#include file="test.usage.js" start="  //#u" stop="  //#r"
  outdent="  " code="javascript" -->
<!--#verbatim lncnt="31" -->
```javascript
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
```
<!--/include-->



<!--#toc stop="scan" -->



Known issues
------------

* needs more/better tests and docs




&nbsp;


License
-------
<!--#echo json="package.json" key=".license" -->
ISC
<!--/#echo -->
