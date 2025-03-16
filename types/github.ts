export interface GitHubRepository {
  name: string;
  forks_count: number;
  open_issues_count: number;
  html_url: string;
  owner: {
    login: string;
    html_url: string;
  };
  readme?: string;
}

export interface GitHubRepositorySearchResult {
  items: GitHubRepository[];
}
