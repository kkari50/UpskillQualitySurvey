# Contributing Guide

This document describes the Git workflow, branching strategy, and version control practices for the Quick Quality Assessment Survey project.

## Table of Contents

- [Branch Strategy](#branch-strategy)
- [Workflow](#workflow)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Version Control](#version-control)
- [Release Process](#release-process)

---

## Branch Strategy

### Main Branches

| Branch | Purpose | Protection |
|--------|---------|------------|
| `main` | Production-ready code | Protected, requires PR |
| `develop` | Integration branch (optional) | Protected |

### Feature Branches

Create feature branches from `main` for all new work:

```bash
# Format: <type>/<short-description>
git checkout -b feature/landing-page
git checkout -b feature/survey-interface
git checkout -b fix/validation-error
git checkout -b refactor/scoring-logic
```

### Branch Naming Conventions

| Prefix | Use Case | Example |
|--------|----------|---------|
| `feature/` | New features | `feature/email-capture` |
| `fix/` | Bug fixes | `fix/score-calculation` |
| `refactor/` | Code refactoring | `refactor/api-structure` |
| `docs/` | Documentation only | `docs/api-readme` |
| `test/` | Test additions | `test/survey-e2e` |
| `chore/` | Maintenance tasks | `chore/update-deps` |

---

## Workflow

### Starting New Work

```bash
# 1. Ensure main is up to date
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/your-feature-name

# 3. Make changes and commit frequently
git add .
git commit -m "Add initial component structure"

# 4. Push branch to remote
git push -u origin feature/your-feature-name
```

### Keeping Branch Updated

```bash
# Rebase your branch on latest main
git fetch origin
git rebase origin/main

# Or merge (creates merge commit)
git merge origin/main
```

### Resolving Conflicts

```bash
# During rebase
git rebase origin/main
# If conflicts occur:
# 1. Edit conflicted files
# 2. Stage resolved files
git add <resolved-files>
# 3. Continue rebase
git rebase --continue
```

---

## Commit Guidelines

### Commit Message Format

```
<type>: <short description>

[optional body with more details]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Formatting, no code change |
| `refactor` | Code restructuring |
| `test` | Adding tests |
| `chore` | Maintenance tasks |
| `perf` | Performance improvements |

### Examples

```bash
# Feature
git commit -m "feat: add email validation to capture form"

# Bug fix
git commit -m "fix: correct score calculation for partial answers"

# Documentation
git commit -m "docs: update API endpoint documentation"

# Refactor
git commit -m "refactor: extract scoring logic into separate module"
```

### Good Commit Practices

1. **Commit often** - Small, focused commits are easier to review
2. **Write meaningful messages** - Future you will thank present you
3. **One logical change per commit** - Don't mix unrelated changes
4. **Test before committing** - Ensure code compiles and tests pass

---

## Pull Request Process

### Creating a PR

1. **Push your branch**
   ```bash
   git push -u origin feature/your-feature
   ```

2. **Create PR on GitHub**
   - Go to repository → Pull Requests → New Pull Request
   - Select your branch
   - Fill in PR template

3. **PR Title Format**
   ```
   feat: Add email capture form
   fix: Resolve score calculation bug
   ```

### PR Template

```markdown
## Summary
Brief description of changes (1-3 bullet points)

## Changes Made
- List of specific changes
- Include file references where helpful

## Test Plan
- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] E2E tests pass

## Screenshots (if applicable)
[Add screenshots for UI changes]

## Related Issues
Closes #123
```

### PR Review Checklist

- [ ] Code follows project style guide
- [ ] Tests are included and pass
- [ ] Documentation is updated if needed
- [ ] No console.log or debug code
- [ ] Mobile responsive (if UI change)
- [ ] Accessibility considered

### Merging PRs

1. **Squash and Merge** (preferred) - Combines all commits into one
2. **Rebase and Merge** - Keeps commit history linear
3. **Create Merge Commit** - Preserves full branch history

---

## Version Control

### Semantic Versioning

We use [Semantic Versioning](https://semver.org/): `MAJOR.MINOR.PATCH`

| Version | When to Increment |
|---------|-------------------|
| MAJOR | Breaking changes |
| MINOR | New features (backwards compatible) |
| PATCH | Bug fixes (backwards compatible) |

### Current Version

Version is tracked in `package.json`:

```json
{
  "version": "0.1.0"
}
```

### Version Milestones

| Version | Description |
|---------|-------------|
| `0.1.0` | Initial development |
| `1.0.0` | V1 public release (MVP) |
| `2.0.0` | V2 with auth and payments |
| `3.0.0` | V3 with full agency model |

---

## Release Process

### Creating a Release

1. **Update version**
   ```bash
   npm version minor  # or major/patch
   ```

2. **Create release branch** (for major releases)
   ```bash
   git checkout -b release/v1.0.0
   ```

3. **Tag the release**
   ```bash
   git tag -a v1.0.0 -m "Release version 1.0.0"
   git push origin v1.0.0
   ```

4. **Create GitHub Release**
   - Go to Releases → Draft new release
   - Select tag
   - Write release notes
   - Publish release

### Release Notes Template

```markdown
## What's New in v1.0.0

### Features
- 27-question quality assessment survey
- Online results dashboard
- Population comparison

### Bug Fixes
- Fixed score calculation edge case

### Breaking Changes
- None

### Migration Guide
- N/A (initial release)
```

---

## Git Commands Quick Reference

```bash
# Status and info
git status                    # Current status
git log --oneline -10         # Recent commits
git branch -a                 # All branches
git diff                      # Unstaged changes

# Working with branches
git checkout -b <branch>      # Create and switch
git checkout <branch>         # Switch branch
git branch -d <branch>        # Delete local branch
git push origin --delete <branch>  # Delete remote branch

# Syncing
git fetch origin              # Get remote changes
git pull origin main          # Pull and merge
git push origin <branch>      # Push to remote

# Undoing
git checkout -- <file>        # Discard file changes
git reset HEAD <file>         # Unstage file
git reset --soft HEAD~1       # Undo last commit (keep changes)
git reset --hard HEAD~1       # Undo last commit (discard changes)

# Stashing
git stash                     # Save uncommitted changes
git stash pop                 # Restore stashed changes
git stash list                # List stashes
```

---

## Troubleshooting

### Common Issues

**Accidentally committed to main:**
```bash
# Create branch from current state
git checkout -b feature/my-work
# Reset main to remote
git checkout main
git reset --hard origin/main
```

**Need to change last commit message:**
```bash
git commit --amend -m "New message"
```

**Committed sensitive data:**
```bash
# Remove from history (destructive!)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch <file>" \
  --prune-empty --tag-name-filter cat -- --all
```

---

## Questions?

If you have questions about the workflow, ask in:
- Team Slack channel
- GitHub Discussions
- Create an issue with the `question` label
