import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express'

import schema from './schema'

const PORT = process.env.PORT || 3000

export function launchApiEndpoint () {
  const app = express()

  app.use(cors())

  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())

  // GraphQL server
  app.use('/graphql', graphqlExpress({ schema }))

  // GraphiQL devtool
  app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
  }))

  app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
}
