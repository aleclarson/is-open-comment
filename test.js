#!/usr/bin/env node

const {test} = require('testpass')

const isOpenComment = require('.')

const tested = {}
const tests = [
  // Basic tests
  [' ', false],
  ['//', true],
  ['/*', true],
  ['/* */', false],
  ['/* */ /*', true],

  // Avoid matching /* where */ exists
  ['/* */*', false],
  ['/*/*/*', false],

  // Avoid matching */ where /* exists
  ['/*/', true],

  // Unless a previous /* has not been closed
  ['/* /*/', false],

  // Ignore unbalanced */
  ['*/ /*', true],

  // Anything after // is ignored
  ['// */', true],
  ['// /*', true],
  ['// /* //', true],
  ['// /* */', true],
  ['// /* */ //', true],

  // Avoid matching // where */ exists
  ['/* *//', false],
  ['/* *///', true],

  // Ignore // within /* */
  ['/* //', true],
  ['/* */ //', true],
  ['/* // */', false],
]

function match(value, expected) {
  // Avoid duplicate tests.
  if (!tested.hasOwnProperty(value)) {
    tested[value] = 1
    test(`"${value}"`, (t) => {
      t.eq(isOpenComment(value), expected)
    })
  }
}

tests.forEach(([value, expected]) => {
  match(value, expected)

  // Test without whitespace.
  const value2 = value.replace(/\s/g, '')
  if (value != value2) match(value2, expected)
})

test('multi-line', (t) => {
  const tests = [
    ['// \n', false],
    ['/* \n', true],
    ['/* \n 0', true],
    ['/* \n\n', true],
    ['/* \n\n */', false],
  ]
  tests.forEach(([value, expected]) => {
    if (isOpenComment(value) != expected) {
      t.fail('"' + value.replace(/\n/g, '\\n') + '" should return ' + expected)
    }
  })
})
