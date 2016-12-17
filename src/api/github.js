import GitHub from 'github-api'
import { parseMarkdownLink, parseGitUrl, parseData } from '../utils/parse'

const gh = new GitHub({
  token: process.env.GITHUB_TOKEN
})

const moduleFields = [
  { key: 'vue', array: true },
  { key: 'links', array: true, map: parseMarkdownLink }
]

let sourceRepo = gh.getRepo('Akryum', 'vue-curated')

function generateId (label) {
  return label.trim().toLowerCase().replace(/\s+/g, '_').replace(/\W/g, '')
}

export async function getModuleSource () {
  return sourceRepo.getContents('master', 'PACKAGES.md', true)
}

export async function getModuleDetails (module) {
  try {
    const details = await module.repo.getDetails()
    return details.data
  } catch (e) {
    console.error(e)
  }
}

export async function getModules () {
  try {
    const file = await getModuleSource()
    const rawSource = file.data
    const lines = rawSource.split('\n')
    const modules = []
    const categories = []
    let lastCategory

    for (let line of lines) {
      // Category
      if (line.indexOf('# ') === 0) {
        const label = line.substr(2)
        const id = generateId(label)

        lastCategory = {
          id,
          label,
          modules: []
        }
        categories.push(lastCategory)
      }

      // Module
      if (line.indexOf('- ') === 0) {
        line = line.substr(2)
        const { fullMatch, label, url } = parseMarkdownLink(line)
        line = line.substr(fullMatch.length)

        const { owner, repoName } = parseGitUrl(url)
        const repo = gh.getRepo(owner, repoName)

        const data = parseData(line, moduleFields)

        const module = {
          label,
          url,
          owner,
          repoName,
          repo,
          category: lastCategory,
          ...data
        }

        modules.push(module)
        lastCategory.modules.push(module)
      }
    }

    return {
      modules,
      categories
    }
  } catch (e) {
    console.error(e)
  }
}
