
import * as GitHub from './github'

import { cacheFactory } from '../utils/cache'
import { generateRepoId } from '../utils/parse'

export const repoReadmes = cacheFactory({
  max: 100,
  maxAge: 1000 * 60 * 5,
  refresh: (owner, name) => GitHub.getRepoReadme(GitHub.getRepo(owner, name)),
  resolveKey: generateRepoId,
})

export const repoDetails = cacheFactory({
  max: 500,
  maxAge: 1000 * 60 * 5,
  refresh: (owner, name) => GitHub.getRepoDetails(GitHub.getRepo(owner, name)),
  resolveKey: generateRepoId,
})

export const repoReleases = cacheFactory({
  max: 500,
  maxAge: 1000 * 60 * 5,
  refresh: (owner, name) => GitHub.getRepoReleases(GitHub.getRepo(owner, name)),
  resolveKey: generateRepoId,
})

export const repoPackageJson = cacheFactory({
  max: 500,
  maxAge: 1000 * 60 * 5,
  refresh: async (owner, name) => {
    const data = await GitHub.getRepoContents(GitHub.getRepo(owner, name), 'package.json')
    if (data) {
      return {
        name: data.name,
        version: data.version,
      }
    }
  },
  resolveKey: generateRepoId,
})
