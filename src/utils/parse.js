export function parseGitUrl (url) {
  if (url.charAt(url.length - 1) === '/') {
    url = url.substr(0, url.length - 1)
  }

  const [, domain] = url.match(/https?:\/\/([\d\w.-]+)/i)
  const parts = url.split('/')
  const repoName = parts.pop()
  const owner = parts.pop()
  return {
    domain,
    repoName,
    owner,
  }
}

export function parseData (line, fields) {
  const data = {}
  const parts = line.split(',')
  for (let part of parts) {
    part = part.trim()
    const separatorIndex = part.indexOf(':')
    if (separatorIndex !== -1) {
      let key = part.substr(0, separatorIndex)
      let value = part.substr(separatorIndex + 1)
      key = key.trim()
      value = value.trim()
      // Accepted fields
      const field = fields.find(f => f.key === key)
      if (field) {
        // Array
        if (field.array) {
          value = value.split('|')
          // Processing
          if (typeof field.map === 'function') {
            value = value.map(field.map)
          }
        } else {
          // Processing
          if (typeof field.map === 'function') {
            value = field.map(value)
          }
        }

        data[key] = value
      }
    }
  }
  return data
}

export function parseMarkdownLink (text) {
  const [fullMatch, label, url] = text.match(/\[(.+?)]\((.+?)\)/)
  return {
    fullMatch,
    label,
    url,
  }
}

export function parseRepoId (id) {
  if (id) {
    const [owner, name] = id.split('::')
    return {
      owner,
      name,
    }
  }
}

export function generateRepoId (owner, name) {
  return `${owner}::${name}`
}
