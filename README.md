
# is-open-comment v0.0.1 

Returns `true` if a string opens a comment without closing it.

- No runtime dependencies.
- Multi-line strings are not supported.
- Comment syntax within a string literal causes a false positive.

```js
const isOpenComment = require('is-open-comment')

isOpenComment('//')       // => true
isOpenComment('/*')       // => true
isOpenComment('/* // */') // => false
```

Look at `test.js` for all supported edge cases.

### Tests

```sh
# Install dev dependencies.
npm i

# Run the tests once.
./test.js

# Run the tests when a file changes.
./test.js -w

# Check for duplicate tests.
./test.js -d
```

