# Scripts Directory

This directory contains utility scripts for managing the repository.

## Available Scripts

### `remerge-pr.sh`

An interactive script to help remerge previous pull requests.

**Usage:**
```bash
# Remerge PR #9 (default)
./scripts/remerge-pr.sh

# Remerge a specific PR number
./scripts/remerge-pr.sh 12
```

**Features:**
- Creates automatic backups before making changes
- Multiple remerge methods (cherry-pick, reset, patch)
- Interactive selection of remerge strategy
- Colored output for better readability
- Safety checks and confirmation prompts
- Helpful next-steps guidance

**Methods Available:**
1. **Cherry-pick head commit** (recommended) - Applies the final commit from the PR
2. **Cherry-pick merge commit** - Applies the entire merge
3. **Reset to merge commit** - Resets current branch to the merge state
4. **Create patch and apply** - Creates a diff patch and applies it
5. **Show diff only** - Preview changes without applying them

The script is pre-configured for PR #9 but can be easily modified for other pull requests.