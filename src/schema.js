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
    modules: [Module]
    module(id: String!): Module
    moduleCategories: [ModuleCategory]
    moduleCategory(id: String!): ModuleCategory
    searchModules(text: String!): [Module]
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
    }
  },
  Module: {
    details: module => Modules.getModuleDetails(module),
    category: module => module.category,
    readme: module => Modules.getModuleReadme(module)
  },
  ModuleCategory: {
    modules: category => category.modules
  },
  Query: {
    modules: (root, args, context) => Modules.getModules(),
    module: (root, { id }, context) => Modules.getModule(id),
    moduleCategories: (root, args, context) => Modules.getCategories(),
    moduleCategory: (root, { id }, context) => Modules.getCategory(id),
    searchModules: (root, { text }, context) => Modules.searchModules(text)
  }
  /* Mutation: {
    addTag: async (root, { type, label }, context) => {
      console.log(`adding ${type} tag '${label}'`)
      const newTag = await Tags.addTag(type, label)
      pubsub.publish('tagAdded', newTag)
      return newTag
    }
  },
  Subscription: {
    tagAdded (tag) {
      return tag
    }
  } */
}

const jsSchema = makeExecutableSchema({
  typeDefs,
  resolvers
})

export default jsSchema
