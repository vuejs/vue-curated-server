import { makeExecutableSchema } from 'graphql-tools'
import { Kind } from 'graphql/language'

import Modules from './connectors'
// import { pubsub } from './subscriptions'

const typeDefs = [`
  scalar Date

  type Link {
    url: String
    label: String
  }

  type Text {
    content: String
  }

  type Release {
    id: String
    label: String
  }

  # Represents a vue module, plugin or package
  type Module {
    id: String
    url: String
    label: String
    details: ModuleDetails
    category: ModuleCategory
    vue: [String]
    links: [Link]
    badge: String
    status: String
    readme: Text
  }

  type ModuleCategory {
    id: String
    label: String
    modules: [Module]
  }

  type ModuleDetails {
    name: String
    description: String
    owner: ModuleOwner
    forks_count: Int
    stargazers_count: Int
    watchers_count: Int
    open_issues_count: Int
    has_wiki: Boolean
    pushed_at: String
    created_at: String
    updated_at: String
  }

  type ModuleOwner {
    login: String
    avatar_url: String
    html_url: String
  }

  type Query {
    modules(searchText: String, category: String, release: String): [Module]
    module(id: String!): Module
    moduleCategories: [ModuleCategory]
    moduleCategory(id: String!): ModuleCategory
    vueReleases: [Release]
  }

  schema {
    query: Query
  }
`]

const resolvers = {
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
    details: module => Modules.getModuleDetails(module),
    category: module => module.category,
    readme: module => Modules.getModuleReadme(module),
  },
  ModuleCategory: {
    modules: category => category.modules,
  },
  Query: {
    modules: (root, { searchText, category, release }, context) => Modules.getModules({
      searchText,
      category,
      release,
    }),
    module: (root, { id }, context) => Modules.getModule(id),
    moduleCategories: (root, args, context) => Modules.getCategories(),
    moduleCategory: (root, { id }, context) => Modules.getCategory(id),
    vueReleases: (root, args, context) => Modules.getVueReleases(),
  },
}

const jsSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

export default jsSchema
