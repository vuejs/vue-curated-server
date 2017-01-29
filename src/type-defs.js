
export const typeDefs = [`
  scalar Date

  type Link {
    url: String
    label: String
  }

  type Text {
    content: String
  }

  type DownloadFile {
    download_url: String
    size: Int
    download_count: Int
  }

  # Major Vue Release, used to filter modules
  type VueRelease {
    id: String
    label: String
  }

  # Represents a vue module, plugin or package
  type Module {
    # <host_platform>::<owner>::<repo>
    id: String
    url: String
    label: String
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

  type ModuleCategory {
    id: String
    label: String
    modules: [Module]
  }

  # Git repository details
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

  type ModuleOwner {
    login: String
    avatar_url: String
    html_url: String
  }

  type ModuleRelease {
    id: Int
    html_url: String
    tag_name: String
    name: String
    body: String
    prerelease: Boolean
    published_at: String
    files: [DownloadFile]
  }

  type NpmPackage {
    name: String
    version: String
    # Downloads for each day in the range. Defaults: range='last-month'
    range_downloads (range: String): [DownloadDay]
  }

  type DownloadDay {
    # Format: 'yyyy-mm-dd'
    day: String
    downloads: Int
  }

  type Query {
    # Specify a category id or a Vue release id to filter the result. Defaults: category=undefined, release=undefined
    modules(category: String, release: String): [Module]
    module(id: String!): Module
    module_categories: [ModuleCategory]
    module_category(id: String!): ModuleCategory
    vue_releases: [VueRelease]
  }

  schema {
    query: Query
  }
`]
