# @dephub/repo 🚀

> CLI tool to automate GitHub repository creation and Git initialization or publishing workflows.

[![NPM version](https://img.shields.io/npm/v/@dephub/repo.svg?style=flat)](https://npmjs.org/package/@dephub/repo)
[![ESM-only](https://img.shields.io/badge/ESM-only-brightgreen?style=flat)](https://nodejs.org/)

## Features ✨

- 🚀 **GitHub Integration**: Automatically creates public GitHub repositories via `gh` CLI.
- 📦 **Git Automation**: Initializes Git, handles `.gitignore`, creates initial commits, sets `main` branch, and links remotes.
- 🏷️ **Version Tagging**: Automatically tags commits with project version (`vX.Y.Z`) and pushes tags to origin.
- 🏷️ **Topic Syncing**: Sets GitHub repository topics dynamically based on `package.json` keywords.
- 🛡️ **Interactive Safety**: Prompts for confirmation before executing remote or destructive operations.

---

## Installation 📦

- npm: `npm install -g @dephub/repo`
- pnpm: `pnpm add -g @dephub/repo`
- yarn: `yarn add -g @dephub/repo`
- bun: `bun add -g @dephub/repo`

---

## Usage 🎯

### CLI 💻

Run directly via `npx` or as a global command:

```bash
# Initialize a new GitHub repository and git workflow
npx @dephub/repo init

# Commit, tag, and push project changes
npx @dephub/repo push

```

---

## License 📄

MIT License – see [LICENSE](https://www.google.com/search?q=LICENSE) for details.

**Author:** Estarlin R ([estarlincito.com](https://estarlincito.com))
