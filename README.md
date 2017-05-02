# vue-curated-server

A GraphQL server for [curated vue packages](https://github.com/Akryum/vue-curated), powered by Apollo.

Set the `GITHUB_TOKEN` env var with a GitHub OAuth token.

Set the `SOURCE_REPO` env var with the repo containing the `PACKAGES.md` file on the root of the `master` branch. For example: `SOURCE_REPO=vuejs/vue-curated`.

Set the `DB_PATH` env var with a path to the database folder with write access.

Set the `UPDATE_INTERVAL` env var with the number of ms between each list update (default is 5 min).

```
npm install
npm start
```

By default, the graphql endpoint is `http://localhost:3000` and GraphiQL is available at `http://localhost:3000/graphiql`. You can change the port with the `PORT` env var.
