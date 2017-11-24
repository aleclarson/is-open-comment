
function isOpenComment(code) {
  const line = code.indexOf('//')
  const blockOpen = code.indexOf('/*')
  if (blockOpen == -1) {
    return line != -1
  }
  if (line != -1 && line < blockOpen) {
    return true
  } else {
    return evalTags(findTags(code))
  }
}

module.exports = isOpenComment

function evalTags(tags) {
  let openIndex = -1
  let closeIndex = -2
  for (const index in tags) {
    const tag = tags[index]
    // Look for //
    if (tag == '//') {
      // Protect against /* *//
      if (index - closeIndex > 1) {
        if (openIndex == -1) {
          return true
        }
      }
    }
    // Look for /*
    else if (openIndex < 0) {
      if (tag == '/*') {
        // Protect against /* */*
        if (index - closeIndex > 1) {
          openIndex = index
        }
      }
    }
    // Look for */
    else if (tag == '*/') {
      // Protect against /*/
      if (index - openIndex > 1) {
        openIndex = -1
        closeIndex = index
      }
    }
  }
  return openIndex != -1
}

// Returns a sparse array of comment tags
function findTags(code) {
  const tags = []
  findTag(code, '//', tags)
  findTag(code, '/*', tags)
  findTag(code, '*/', tags)
  return tags
}

function findTag(code, tag, tags) {
  let index = -1
  while ((index = code.indexOf(tag, index + 1)) != -1) {
    tags[index] = tag
  }
}