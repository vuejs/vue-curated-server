import LRU from 'lru-cache'
import Fuse from 'fuse.js'

import * as GitHub from './api/github'

// Cache

const detailsCache = LRU({
  max: 500,
  maxAge: 1000 * 60
})

const readmeCache = LRU({
  max: 500,
  maxAge: 1000 * 60
})

const listCacheMaxTime = 1000 * 60 * 5
let lastListTime = 0
let listCache = null

function wrapModuleCache (func, cache, freshCb = null) {
  return async module => {
    let data = cache.get(module.id)
    if (!data) {
      data = await func(module)
      cache.set(module.id, data)
      if (freshCb) {
        freshCb(module, data)
      }
    }
    return data
  }
}

// Search

let index = []
const fuse = new Fuse(index, {
  include: ['score'],
  shouldSort: true,
  threshold: 0.4,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [
    {
      name: 'label',
      weight: 0.3
    },
    {
      name: 'url',
      weight: 0.1
    },
    {
      name: 'category',
      weight: 0.1
    },
    {
      name: 'description',
      weight: 0.1
    },
    {
      name: 'owner',
      weight: 0.1
    }
  ],
  id: 'id'
})

function indexModule (module, details) {
  const doc = {
    id: module.id,
    url: module.url,
    label: module.label,
    category: module.category.label,
    description: details.description,
    owner: details.owner.login
  }
  const i = index.findIndex(doc => doc.id === module.id)
  if (i === -1) {
    index.push(doc)
  } else {
    index[i] = doc
  }
}

async function searchModules (searchText) {
  if (!searchText) {
    return []
  }
  const { modules } = await getLists()
  const result = fuse.search(searchText)
  console.log(result)
  return result.map(r => modules.find(m => m.id === r.item))
}

// Data

async function fetchLists () {
  const lists = await GitHub.getModules(module)
  listCache = lists
  lastListTime = Date.now()
  // Indexing
  for (const module of lists.modules) {
    getModuleDetails(module)
  }
  return lists
}

async function getLists () {
  let lists = listCache
  if (!lists) {
    lists = await fetchLists()
  } else if (Date.now() - lastListTime > listCacheMaxTime) {
    fetchLists()
  }
  return lists
}

async function getModule (id) {
  const { modules } = await getLists()
  return modules.find(m => m.id === id)
}

async function getCategory (id) {
  const { categories } = await getLists()
  return categories.find(c => c.id === id)
}

const getModuleDetails = wrapModuleCache(GitHub.getModuleDetails, detailsCache, (module, data) => indexModule(module, data))

const getModuleReadme = wrapModuleCache(GitHub.getModuleReadme, readmeCache)

export default {
  getModules: async () => {
    const { modules } = await getLists()
    return modules
  },
  getCategories: async () => {
    const { categories } = await getLists()
    return categories
  },
  getModuleDetails,
  getModuleReadme,
  searchModules,
  getModule,
  getCategory
}
