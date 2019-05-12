const babel = require('@babel/core');

function transform(code, options) {
  return babel.transformSync(code, { presets: [['./', options]] }).code;
}

test('react', () => {
  expect(
    transform(`import React from 'react';
    const App = () => <div>test</div>`)
  ).toMatchInlineSnapshot(`
"\\"use strict\\";

var _interopRequireDefault = require(\\"@babel/runtime/helpers/interopRequireDefault\\");

var _react = _interopRequireDefault(require(\\"react\\"));

var App = function App() {
  return _react.default.createElement(\\"div\\", null, \\"test\\");
};"
`);
});

test('spread', () => {
  expect(
    transform(`let [a, b, ...rest] = arr;
let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };`)
  ).toMatchInlineSnapshot(`
"\\"use strict\\";

var _interopRequireDefault = require(\\"@babel/runtime/helpers/interopRequireDefault\\");

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require(\\"@babel/runtime/helpers/objectWithoutPropertiesLoose\\"));

var _arr = arr,
    a = _arr[0],
    b = _arr[1],
    rest = _arr.slice(2);

var _x$y$a$b = {
  x: 1,
  y: 2,
  a: 3,
  b: 4
},
    x = _x$y$a$b.x,
    y = _x$y$a$b.y,
    z = (0, _objectWithoutPropertiesLoose2.default)(_x$y$a$b, [\\"x\\", \\"y\\"]);"
`);
});

test('dynamic import', () => {
  expect(transform(`const x = lazy(() => import('x'));`))
    .toMatchInlineSnapshot(`
"\\"use strict\\";

var x = lazy(function () {
  return import('x');
});"
`);
});

test('preval', () => {
  expect(transform('const x = preval`module.exports = 1`'))
    .toMatchInlineSnapshot(`
"\\"use strict\\";

var x = 1;"
`);
});

test('emotion', () => {
  expect(
    transform(`/** @jsx jsx */
import { jsx, css } from '@emotion/core';

const Button = (children) => <button css={css\`
  background-color: red;
  \`}>{children}</button>
`)
  ).toMatchInlineSnapshot(`
"\\"use strict\\";

var _core = require(\\"@emotion/core\\");

/** @jsx jsx */
var _ref = process.env.NODE_ENV === \\"production\\" ? {
  name: \\"c5mkt3-Button\\",
  styles: \\"background-color:red;label:Button;\\"
} : {
  name: \\"c5mkt3-Button\\",
  styles: \\"background-color:red;label:Button;\\",
  map: \\"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInVua25vd24iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRzZDIiwiZmlsZSI6InVua25vd24iLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGpzeCBqc3ggKi9cbmltcG9ydCB7IGpzeCwgY3NzIH0gZnJvbSAnQGVtb3Rpb24vY29yZSc7XG5cbmNvbnN0IEJ1dHRvbiA9IChjaGlsZHJlbikgPT4gPGJ1dHRvbiBjc3M9e2Nzc2BcbiAgYmFja2dyb3VuZC1jb2xvcjogcmVkO1xuICBgfT57Y2hpbGRyZW59PC9idXR0b24+XG4iXX0= */\\"
};

var Button = function Button(children) {
  return (0, _core.jsx)(\\"button\\", {
    css: _ref
  }, children);
};"
`);
});

test('generator', () => {
  expect(
    transform(`function* a() {
  yield 1;
}`)
  ).toMatchInlineSnapshot(`
"\\"use strict\\";

var _interopRequireDefault = require(\\"@babel/runtime/helpers/interopRequireDefault\\");

var _regenerator = _interopRequireDefault(require(\\"@babel/runtime/regenerator\\"));

var _marked =
/*#__PURE__*/
_regenerator.default.mark(a);

function a() {
  return _regenerator.default.wrap(function a$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return 1;

        case 2:
        case \\"end\\":
          return _context.stop();
      }
    }
  }, _marked);
}"
`);
});

test('react remove prop types in production', () => {
  expect(
    transform(
      `import PropTypes from 'prop-types';
const App = ({name}) => <div>{name}</div>;
App.propTypes = { name: PropTypes.string };`,
      { production: true }
    )
  ).toMatchInlineSnapshot(`
"\\"use strict\\";

var App = function App(_ref) {
  var name = _ref.name;
  return React.createElement(\\"div\\", null, name);
};"
`);
});
