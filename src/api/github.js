import GitHub from 'github-api'
import { parseMarkdownLink, parseGitUrl, parseData } from '../utils/parse'

const gh = new GitHub({
  token: process.env.GITHUB_TOKEN
})

const moduleFields = [
  { key: 'vue', array: true },
  { key: 'links', array: true, map: parseMarkdownLink },
  { key: 'status' },
  { key: 'badge' }
]

let sourceRepo = gh.getRepo('Akryum', 'vue-curated')

function generateCategoryId (label) {
  return label.trim().toLowerCase().replace(/\s+/g, '_').replace(/\W/g, '')
}

function generateModuleId (domain, owner, repoName) {
  return `${domain.replace(/\./g, '_')}::${owner}::${repoName}`
}

export async function getModuleSource () {
  return sourceRepo.getContents('master', 'PACKAGES.md', true)
}

export async function getModuleDetails (module) {
  try {
    const result = await module.repo.getDetails()
    module.default_branch = result.data.default_branch
    return result.data
  } catch (e) {
    console.error(e)
  }
}

export async function getModuleReadme (module) {
  try {
    const result = await module.repo.getReadme(module.default_branch, true)
    return {
      content: result.data
    }
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
        const id = generateCategoryId(label)

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

        const { domain, owner, repoName } = parseGitUrl(url)
        const id = generateModuleId(domain, owner, repoName)
        const repo = gh.getRepo(owner, repoName)

        const data = parseData(line, moduleFields)

        const module = {
          id,
          label,
          url,
          owner,
          repoName,
          repo,
          category: lastCategory,
          default_branch: 'master',
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
