import GitHub from 'github-api'

const gh = new GitHub({
  token: process.env.GITHUB_TOKEN
})

let sourceRepo = gh.getRepo('Akryum', 'vue-curated')

function parseGitUrl (url) {
  if (url.charAt(url.length - 1) === '/') {
    url = url.substr(0, url.length - 1)
  }

  const parts = url.split('/')
  const repoName = parts.pop()
  const owner = parts.pop()
  return {
    repoName,
    owner
  }
}

function generateId (label) {
  return label.trim().toLowerCase().replace(/\s+/g, '_').replace(/\W/g, '')
}

export async function getModuleSource () {
  return sourceRepo.getContents('master', 'MODULES.md', true)
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
        const [, label, url] = line.match(/\[(.+)]\((.+)\)/)

        const { owner, repoName } = parseGitUrl(url)
        console.log(url, owner, repoName)
        const repo = gh.getRepo(owner, repoName)

        const module = {
          label,
          url,
          owner,
          repoName,
          repo,
          category: lastCategory
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
