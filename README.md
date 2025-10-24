# SparkChats App

## Getting started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the Expo development server:
   ```bash
   npm run dev
   ```
3. Run quality checks before committing:
   ```bash
   npm run lint
   npm run typecheck
   ```

## Troubleshooting

### `git pull` aborts with "Need to specify how to reconcile divergent branches"
Newer versions of Git require you to pick a default strategy the first time a pull would need a merge or rebase. Choose one of the following commands (you only need to run it once on your machine):

```bash
git config pull.rebase false   # always merge when pulling
git config pull.rebase true    # always rebase when pulling
git config pull.ff only        # refuse non fast-forward pulls
```

If you prefer to decide per pull, you can append `--rebase`, `--no-rebase`, or `--ff-only` to the `git pull` command instead.

### Resetting the dependency tree
If npm install fails with peer dependency errors, clean the install state and try again:

```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```
