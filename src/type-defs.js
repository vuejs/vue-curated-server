
export const typeDefs = [`
  scalar Date

  # Represents an absolute URL
  type Link {
    url: String!
    label: String
  }

  # Text contents
  type Text {
    content: String
  }

  # Downloadable file URL & general info
  type DownloadFile {
    download_url: String!
    size: Int
    download_count: Int
  }

  # Main entities
  interface Entity {
    id: ID!
    label: String!
  }

  # Major Vue Release, used to filter modules
  type VueRelease implements Entity {
    id: ID!
    label: String!
  }

  # Represents a vue module, plugin or package
  type Module implements Entity {
    # <host_platform>::<owner>::<repo>
    id: ID!
    # Displayed name
    label: String!
    # Repo URL
    url: String!
    # Git repository details
    details: ModuleDetails
    category: ModuleCategory
    # Compatible Vue releases
    vue: [String]
    # Useful links
    links: [Link]
    # Special badge (ex: 'official')
    badge: String
    # Developpement status (ex: 'stable')
    status: String
    # Default 'Readme.md' contents
    readme: Text
    # GitHub release tags
    releases: [ModuleRelease]
    npm_package: NpmPackage
  }

  # Category like 'routing' or 'state management'
  type ModuleCategory implements Entity {
    id: ID!
    label: String!
    modules: [Module]
  }

  # Module Git repository details
  type ModuleDetails {
    name: String
    description: String
    owner: ModuleOwner
    forks_count: Int
    stargazers_count: Int
    watchers_count: Int
    open_issues_count: Int
    has_wiki: Boolean
    default_branch: String
    pushed_at: String
    created_at: String
    updated_at: String
  }

  # User or Org owning the repository
  type ModuleOwner {
    # Name
    login: String!
    avatar_url: String
    html_url: String
  }

  # Release (GitHub)
  type ModuleRelease {
    id: Int
    html_url: String
    # Used on GitHub, e.g. 'v1.0'
    tag_name: String
    name: String
    # Release description
    body: String
    prerelease: Boolean
    published_at: String
    # Downloadable files
    files: [DownloadFile]
  }

  # Package from npm registry
  type NpmPackage {
    name: String
    version: String
    # Downloads for each day in the range. Defaults: range='last-month'
    range_downloads (range: String): [DownloadDay]
  }

  # Downloads stats unit
  type DownloadDay {
    # Format: 'yyyy-mm-dd'
    day: String
    # Downloads count
    downloads: Int
  }

  # Entry queries
  type Query {
    # Get module list. Specify a category id or a Vue release id to filter the result. Use release='_LATEST_' to use latest vue release. Defaults: category=undefined, release=undefined
    modules(category: String, release: String): [Module]
    # Get a single module by its id
    module(id: ID!): Module
    # Get all module categories
    module_categories: [ModuleCategory]
    # Get a single module category by its id
    module_category(id: ID!): ModuleCategory
    # Get all represented Vue releases
    vue_releases: [VueRelease]
  }

  schema {
    query: Query
  }
`]
