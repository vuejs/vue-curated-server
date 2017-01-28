
import * as GitHub from '../providers/github'
import * as Database from '../providers/database'
import * as Memory from '../providers/memory'

export async function updateDatasets () {
  try {
    const {
      modules,
      categories,
      releases,
    } = await GitHub.getModules()

    await Database.modules.sync(modules)
    await Database.categories.sync(categories)
    Memory.vueReleases.reset(releases)

    console.log('updateDatasets completed')

    return true
  } catch (e) {
    console.error(e)

    return false
  }
}
