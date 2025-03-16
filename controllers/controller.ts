import { Request, Response, NextFunction } from 'express';
import getReadme from '../helper/getReadMe.js';
import axios from 'axios';

interface GitHubRepo {
  name: string;
  forks_count: number;
  open_issues_count: number;
  owner: {
    login: string;
  };
  readme?: string;
}

interface GitHubApiResponse {
  items: GitHubRepo[];
}

const userName = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const repoName =
      typeof req.query.name === 'string' ? req.query.name : undefined;

    if (!repoName) {
      res.status(400).json({ error: 'Repository name is required' });
      return;
    }

    const githubResponse = await axios.get<GitHubApiResponse>(
      `https://api.github.com/search/repositories?q=${repoName}`
    );

    const repositories = await Promise.all(
      githubResponse.data.items.map(async (repo) => {
        const readmeContent = await getReadme(repo.owner.login, repo.name);
        return {
          name: repo.name,
          forks: repo.forks_count,
          open_issues: repo.open_issues_count,
          readme: readmeContent || 'README not found',
        };
      })
    );

    res.status(200).json(repositories);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch data from GitHub',
      details: (error as Error).message,
    });
  }
};

export default userName;
