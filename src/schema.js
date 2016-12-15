
import { makeExecutableSchema } from 'graphql-tools'

import Modules from './connectors'
// import { pubsub } from './subscriptions'

const typeDefs = [`
  type Module {
    url: String
    label: String
    details: ModuleDetails
    category: ModuleCategory
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
  }

  type ModuleOwner {
    login: String
    avatar_url: String
    url: String
  }

  type Query {
    modules: [Module]
    moduleCategories: [ModuleCategory]
  }

  schema {
    query: Query
  }
`]

const resolvers = {
  Module: {
    details: module => Modules.getModuleDetails(module),
    category: module => module.category
  },
  ModuleCategory: {
    modules: category => category.modules
  },
  Query: {
    modules (root, args, context) {
      return Modules.getModules()
    },
    moduleCategories (root, args, context) {
      return Modules.getCategories()
    }
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
