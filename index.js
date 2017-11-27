
function isOpenComment(code) {
  const lineBreak = code.lastIndexOf('\n')
  const lastLine = ~lineBreak ? code.slice(lineBreak + 1) : code
  const line = lastLine.indexOf('//')
  const blockOpen = code.indexOf('/*')
  if (blockOpen == -1) {
    return line != -1
  }
  if (line != -1 && line < blockOpen) {
    return true
  } else {
    return evalTags(findTags(code), lineBreak)
  }
}

module.exports = isOpenComment

function evalTags(tags, lineBreak) {
  let canOpen = true
  let openIndex = -1
  let closeIndex = -2
  for (const index in tags) {
    const tag = tags[index]
    if (canOpen) {
      if (tag == '/*') {
        // Protect against "/* */*"
        if (index - closeIndex > 1) {
          // Ignore "/*" and "//" until "*/" is found
          canOpen = false
          openIndex = index
        }
      }
      else if (tag == '//') {
        // Protect against "/* *//"
        if (index - closeIndex < 2) {
          continue
        }
        // Return true if on last line
        if (index > lineBreak) {
          return true
        } else {
          // Ignore "/*" and "//" on same line
          canOpen = false
        }
      }
    }
    else if (tag == '\n') {
      // Line break only closes "//"
      if (openIndex == -1) {
        canOpen = true
      }
    }
    else if (tag == '*/') {
      // Protect against "/*/"
      if (index - openIndex > 1) {
        canOpen = true
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
  findTag(code, '\n', tags)
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
