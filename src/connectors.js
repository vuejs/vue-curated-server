import LRU from 'lru-cache'

import { getModules, getModuleDetails } from './api/github'

const detailsCache = LRU({
  max: 500,
  maxAge: 1000 * 60
})

const listCache = LRU({
  maxAge: 1000 * 60 * 5
})

async function getLists () {
  let lists = listCache.get('lists')
  if (!lists) {
    lists = await getModules(module)
    detailsCache.set('lists', lists)
  }
  return lists
}

export default {
  getModules: async () => {
    const { modules } = await getLists()
    return modules
  },
  getCategories: async () => {
    const { categories } = await getLists()
    return categories
  },
  getModuleDetails: async module => {
    let details = detailsCache.get(module.url)
    if (!details) {
      details = await getModuleDetails(module)
      detailsCache.set(module.url, details)
    }
    return details
  }
}
