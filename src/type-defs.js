
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

  type VueRelease {
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
    releases: [ModuleRelease]
    npm_package: NpmPackage
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
    day: String
    downloads: Int
  }

  type Query {
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
