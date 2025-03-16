import { Request, Response, NextFunction } from 'express';
import getReadme from '../helper/getReadMe.js';
import axios from 'axios';
import ApiError from '../models/http-error';

interface GitHubRepo {
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
      throw new ApiError('Repository name is require', 400);
    }

    const githubResponse = await axios.get<GitHubApiResponse>(
      `https://api.github.com/search/repositories?q=${repoName}`
    );

    if (!githubResponse.data.items.length) {
      throw new ApiError('No repositories found', 404);
    }

    const repositories = await Promise.all(
      githubResponse.data.items.map(async (repo) => {
        const readmeContent = await getReadme(repo.owner.login, repo.name);
        return {
          name: repo.name,
          forks: repo.forks_count,
          open_issues: repo.open_issues_count,
          url: repo.owner.html_url,
          readme: readmeContent || 'README not found',
        };
      })
    );

    res.status(200).json(repositories);
  } catch (error) {
    next(new ApiError('Failed to fetch data from GitHub', 500));
  }
};

export default userName;
