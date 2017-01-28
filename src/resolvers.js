
import { Kind } from 'graphql/language'

import * as Modules from './connectors/modules'
import * as NpmPackages from './connectors/npm-packages'

export const resolvers = {
  Date: {
    __parseValue: value => new Date(value), // value from the client
    __serialize: value => value.getTime(), // value sent to the client
    __parseLiteral (ast) {
      if (ast.kind === Kind.INT) {
        return (parseInt(ast.value, 10)) // ast value is always in string format
      }
      return ast.value
    },
  },

  Module: {
    details: module => Modules.getModuleDetails(module.id),
    category: module => Modules.getCategory(module.category_id),
    readme: module => Modules.getModuleReadme(module.id),
    releases: module => Modules.getModuleReleases(module.id),
    npm_package: module => Modules.getModuleNpmPackage(module.id),
  },

  ModuleCategory: {
    modules: category => Modules.getModules({ category: category.id }),
  },

  NpmPackage: {
    range_downloads: (npmPackage, { range }) => NpmPackages.getRangeDownloads(npmPackage.name, range),
  },

  Query: {
    modules: (root, { category, release }, context) => Modules.getModules({
      category,
      release,
    }),
    module: (root, { id }, context) => Modules.getModule(id),
    module_categories: (root, args, context) => Modules.getCategories(),
    module_category: (root, { id }, context) => Modules.getCategory(id),
    vue_releases: (root, args, context) => Modules.getVueReleases(),
  },
}
