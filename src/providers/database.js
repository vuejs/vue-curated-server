
import { collectionFactory, modelFactory } from '../utils/database'

const idIndex = {
  fieldName: 'id',
  unique: true,
}

export const modules = modelFactory(collectionFactory('modules', idIndex))
export const categories = modelFactory(collectionFactory('categories', idIndex, false))

export function clearDatabase () {
  return Promise.all([
    modules.remove({}),
    categories.remove({}),
  ])
}
