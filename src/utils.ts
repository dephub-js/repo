/* eslint-disable security/detect-non-literal-fs-filename */
import { CommandError } from '@dephub/command';
import { path, useCwd } from '@dephub/path';
import { readFile } from '@dephub/read';
import { slug } from '@dephub/slug';
import { writeFile } from '@dephub/write';
import { existsSync } from 'node:fs';

export async function checkGitIgnore(): Promise<void> {
  const gitignorePath = path.join(useCwd(), '.gitignore');

  const gitignoreContent = [
    '/node_modules',
    '/dist',
    '/build',
    '/output',
    '/temp',
    '/playground',
    '/.pnp',
    '.pnp.js',
    '/coverage',
    '/out/',
    '.DS_Store',
    '*.pem',
    'npm-debug.log*',
    'yarn-debug.log*',
    'yarn-error.log*',
    '.pnpm-debug.log*',
    '.env*.local',
    '/temp',
  ];

  if (!existsSync(gitignorePath)) {
    await writeFile(gitignorePath, gitignoreContent.join('\n'));
  }
}

export async function getPackageData(): Promise<{
  description: string;
  keywords: string[];
  name: string;
  repoName: string;
  repoUrl: string;
  version: string;
}> {
  const raw = await readFile(useCwd('package.json'), 'utf-8');
  const pkg = JSON.parse(raw);

  if (!isObject(pkg))
    throw new CommandError('Invalid package.json: expected an object');

  function getValue(key: string): unknown {
    const value = pkg[key];

    if (!(key in pkg))
      throw new CommandError(`[${key}] is required in package.json`);

    return value;
  }

  function getStrValue(key: string): string {
    const value = getValue(key);
    if (typeof value === 'string') return value;
    throw new CommandError(`[${key}] must be a string in package.json`);
  }

  function getKeywords(): Array<string> {
    const keywords = getValue('keywords');

    if (!Array.isArray(keywords) || !keywords.every(isString)) {
      throw new CommandError(
        '[keywords] must be an array of strings in package.json',
      );
    }

    return keywords.map((keyword) => slug(keyword));
  }

  function getRepoUrl(): string {
    const repository = getValue('repository');

    if (!isObject(repository) || !isString(repository.url)) {
      throw new CommandError(
        '[repository.url] must be a string in package.json',
      );
    }

    return repository.url;
  }

  function getRepoName() {
    const repoUrl = getRepoUrl();
    const githubPrefix = 'https://github.com/';

    if (!repoUrl.startsWith(githubPrefix) || !repoUrl.endsWith('.git')) {
      throw new CommandError('[repository.url] must be a valid GitHub URL');
    }

    return repoUrl.slice(githubPrefix.length, -4);
  }

  const description = getStrValue('description');
  const keywords = getKeywords();
  const name = getStrValue('name');
  const repoUrl = getRepoUrl();
  const repoName = getRepoName();

  const version = getStrValue('version');

  return {
    description,
    keywords,
    name,
    repoName,
    repoUrl,
    version,
  };
}

function isObject(value: unknown): value is Record<string, unknown> {
  if (typeof value === 'object') return true;
  return false;
}

function isString(value: unknown): value is string {
  if (typeof value === 'string') return true;
  return false;
}
