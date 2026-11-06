#!/usr/bin/env node
/* eslint-disable no-console */
import { confirm } from '@dephub/ask';
import { Command, CommandError, type Types } from '@dephub/command';
import process from 'node:process';

import * as pkg from '@/pkg.js';

import { checkGitIgnore, getPackageData } from './utils.js';

const cmd = new Command()
  .name(pkg.name.split('/')[1] ?? 'repo')
  .description(pkg.description)
  .version(pkg.version);

const {
  description,
  keywords,
  name,
  repoName,
  repoUrl,
  version: version_,
} = await getPackageData();

const message = `${name}@${version_}`;
const version = `v${version_}`;
const inherit: Types.ExecutionOptionValues = { stdio: 'inherit' };

cmd
  .command('init', 'Initialize a new project')
  .handler(async () => {
    const confirmed = await confirm(
      `🚀 Create public GitHub repository "${repoName}"? `,
    );

    if (!confirmed) process.exit(0);
  })
  .exec(
    'gh',
    ['repo', 'create', repoName, '--public', '--description', description],
    inherit,
  )
  .handler(() => {
    process.stdout.write('✔ GitHub repository created successfully.\n');
  })
  .handler(async () => {
    const confirmed = await confirm(
      `📦 Initialize ${name}@${version_} repository? `,
    );

    if (!confirmed) process.exit(0);
  })
  .exec('git', ['init'], inherit)
  .handler(async () => await checkGitIgnore())
  .exec('git', ['add', '.'], inherit)
  .exec('git', ['commit', '-m', message], inherit)
  .exec('git', ['branch', '-M', 'main'], inherit)
  .exec('git', ['remote', 'add', 'origin', repoUrl], inherit)
  .exec('git', ['push', '-u', 'origin', 'main'], inherit)
  .exec('git', ['tag', version], inherit)
  .exec('git', ['push', 'origin', version], inherit)
  .exec(
    'gh',
    ['repo', 'edit', repoName, '--add-topic', keywords.join(',')],
    inherit,
  )
  .handler(() => {
    process.stdout.write('✔ Project initialized successfully.\n');
  });

cmd
  .command('push', 'Commit and push changes')
  .handler(async () => {
    const confirmed = await confirm(`🚀 Commit and push ${name}@${version_}? `);

    if (!confirmed) process.exit(0);
  })
  .exec('git', ['add', '.'], inherit)
  .exec('git', ['commit', '-m', message], inherit)
  .exec('git', ['push'], inherit)
  .exec('git', ['tag', version], inherit)
  .exec('git', ['push', 'origin', version], inherit)
  .handler(() => {
    process.stdout.write('✔ Changes pushed successfully.\n');
  });

try {
  await cmd.run();
} catch (err) {
  if (err instanceof CommandError) {
    console.error(`\nError: ${err.message}\n`);
    cmd.help();
    process.exit(1);
  }
  throw err;
}
