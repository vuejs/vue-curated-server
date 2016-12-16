import LRU from 'lru-cache'
import Fuse from 'fuse.js'

import * as GitHub from './api/github'

// Cache

const detailsCache = LRU({
  max: 500,
  maxAge: 1000 * 60
})

const listCache = LRU({
  maxAge: 1000 * 60 * 5
})

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
  id: 'url'
})

function indexModule (module, details) {
  const doc = {
    url: module.url,
    label: module.label,
    category: module.category.label,
    description: details.description,
    owner: details.owner.login
  }
  const i = index.findIndex(doc => doc.url === module.url)
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
  return result.map(r => modules.find(m => m.url === r.item))
}

// Data

async function getLists () {
  let lists = listCache.get('lists')
  if (!lists) {
    lists = await GitHub.getModules(module)
    listCache.set('lists', lists)
    // Indexing
    for (const module of lists.modules) {
      getModuleDetails(module)
    }
  }
  return lists
}

async function getModule (url) {
  const { modules } = await getLists()
  return modules.find(m => m.url === url)
}

async function getCategory (id) {
  const { categories } = await getLists()
  return categories.find(c => c.id === id)
}

async function getModuleDetails (module) {
  let details = detailsCache.get(module.url)
  if (!details) {
    details = await GitHub.getModuleDetails(module)
    detailsCache.set(module.url, details)
    indexModule(module, details)
  }
  return details
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
  getModuleDetails,
  searchModules,
  getModule,
  getCategory
}
