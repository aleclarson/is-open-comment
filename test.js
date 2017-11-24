#!/usr/bin/env node

const huey = require('huey')

const isOpenComment = require('.')

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

// Run the tests.
runTests()

// Enable watch mode.
if (~process.argv.indexOf('-w')) {
  require('fs').watch(process.cwd(), (event, file) => {
    if (/\.js$/.test(file)) {
      // Clear the screen, run the tests again.
      process.stdout.write('\033[2J')
      process.stdout.write('\033[0f')
      runTests()
    }
  })
}

function runTests() {
  const tested = {}
  function dedupe(value) {
    if (tested.hasOwnProperty(value)) {
      if (~process.argv.indexOf('-d')) {
        console.log(huey.yellow('Dupe: ') + value)
      }
      return false
    }
    tested[value] = 1
    return true
  }

  tests.forEach(test => {
    const [value, expected] = test
    if (dedupe(value)) {
      runTest(value, expected)
    }

    // Test without whitespace.
    const value2 = value.replace(/\s/g, '')
    if (value != value2) {
      if (dedupe(value2)) {
        runTest(value2, expected)
      }
    }
  })
}

function runTest(value, expected) {
  const result = isOpenComment(value)
  if (result == expected) {
    console.log(huey.green('Pass: ') + value)
  } else {
    console.log(huey.red('Fail: ') + value + huey.gray(' != ' + expected))
  }
}
