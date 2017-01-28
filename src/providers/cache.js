
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
