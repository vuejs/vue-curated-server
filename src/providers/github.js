
import GitHub from 'github-api'
import { parseMarkdownLink, parseGitUrl, parseData, parseRepoId } from '../utils/parse'

// GitHub API token
const TOKEN = process.env.GITHUB_TOKEN
if (!TOKEN) {
  throw new Error('Please provide a GitHub API token with the `GITHUB_TOKEN` env var.')
}

// Source repo
const repoRaw = process.env.SOURCE_REPO
if (!repoRaw) {
  throw new Error('Please provide the source repo where the packages are listed with the `SOURCE_REPO` env var, e.g. SOURCE_REPO=vuejs/vue-curated')
}
const repoStrings = repoRaw.split('/')
if (repoStrings.length !== 2) {
  throw new Error('The `SOURCE_REPO` value must be of the form <owner>/<repo>, e.g. SOURCE_REPO=vuejs/vue-curated')
}
const OWNER = repoStrings[0]
const REPO = repoStrings[1]

const gh = new GitHub({
  token: TOKEN,
})

// Fields parsed from the md file
const moduleFields = [
  { key: 'vue', array: true },
  { key: 'links', array: true, map: parseMarkdownLink },
  { key: 'status' },
  { key: 'badge' },
]

// GitHub repo containing the packages list
let sourceRepo = gh.getRepo(OWNER, REPO)

function generateCategoryId (label) {
  return label.trim().toLowerCase().replace(/\s+/g, '_').replace(/\W/g, '')
}

function generateModuleId (domain, owner, repoName) {
  return `${domain.replace(/\./g, '_')}::${owner}::${repoName}`
}

async function getModuleSource () {
  return sourceRepo.getContents('master', 'PACKAGES.md', true)
}

export function getRepo (owner, name) {
  return gh.getRepo(owner, name)
}

export function getRepoFromId (id) {
  const { owner, name } = parseRepoId(id)
  return getRepo(owner, name)
}

export async function getRepoDetails (repo) {
  try {
    const result = await repo.getDetails()
    return result.data
  } catch (e) {
    console.error(e)
  }
}

export async function getRepoReadme (repo) {
  try {
    const result = await repo.getReadme(undefined, true)
    return {
      content: result.data,
    }
  } catch (e) {
    console.error(e)
  }
}

export async function getRepoContents (repo, path) {
  try {
    const result = await repo.getContents(undefined, path, true)
    return result.data
  } catch (e) {
    console.error(e)
  }
}

export async function getRepoReleases (repo) {
  try {
    const result = await repo.listReleases()
    return result.data.map(release => {
      return {
        id: release.id,
        html_url: release.html_url,
        tag_name: release.tag_name,
        name: release.name,
        body: release.body,
        prerelease: release.prerelease,
        published_at: release.published_at,
        files: release.assets.map(asset => {
          return {
            download_url: asset.browser_download_url,
            size: asset.size,
            download_count: asset.download_count,
          }
        }),
      }
    })
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
    const releases = []
    let lastCategory

    for (let line of lines) {
      // Category
      if (line.indexOf('# ') === 0) {
        const label = line.substr(2)
        const id = generateCategoryId(label)

        lastCategory = {
          id,
          label,
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

        const data = parseData(line, moduleFields)

        const module = {
          id,
          label,
          url,
          owner,
          repoName,
          category_id: lastCategory.id,
          ...data,
        }

        data.vue.forEach(vue => {
          if (!releases.find(r => r.id === vue)) {
            releases.push({
              id: vue,
              label: `Vue ${vue}`,
            })
          }
        })

        modules.push(module)
      }
    }

    categories.sort((a, b) => a.label < b.label ? -1 : 1)
    releases.sort((a, b) => b.id < a.id ? -1 : 1)

    return {
      modules,
      categories,
      releases,
    }
  } catch (e) {
    console.error(e)
  }
}
