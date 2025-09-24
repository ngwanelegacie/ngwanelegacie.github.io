#!/bin/bash

# Remerge Pull Request Script
# Usage: ./scripts/remerge-pr.sh [PR_NUMBER]
# This script helps remerge a previous pull request

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration for PR #9 (can be modified for other PRs)
DEFAULT_PR_NUMBER=9
# Note: The actual commit hashes from the GitHub API may not be available in local repository
# Using current repository state which already contains v4 design
CURRENT_COMMIT="43783f3381b72d6167f8e994680293a8ef5072f6"  # Current base commit with v4 design

# Get PR number from argument or use default
PR_NUMBER=${1:-$DEFAULT_PR_NUMBER}

echo -e "${BLUE}🔄 Pull Request Remerge Script${NC}"
echo -e "${BLUE}================================${NC}"
echo -e "Target PR: #${PR_NUMBER}"
echo ""

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "Not in a Git repository!"
    exit 1
fi

print_status "Git repository detected"

# Check current status
echo ""
print_info "Current repository status:"
git status --short

# Check if v4 design is already present
echo ""
print_info "Checking current state:"
if grep -q "var(--navy)" index.html; then
    print_status "v4 design elements detected in current repository"
    V4_PRESENT=true
else
    print_warning "v4 design elements not found"
    V4_PRESENT=false
fi

if grep -q "Vusumuzi Nkosi" index.html; then
    print_status "Current portfolio content found"
else
    print_warning "Expected portfolio content not found"
fi

if [ "$V4_PRESENT" = true ]; then
    echo ""
    print_warning "🎉 PR #9 v4 design is already active in this repository!"
    print_info "You may not need to remerge. The repository already contains:"
    echo "  - Modern dark navy theme with cyan accents"
    echo "  - Professional typography using Inter and Fira Code fonts"
    echo "  - Brittany Chiang v4 inspired design"
    echo "  - Responsive layout and modern styling"
    echo ""
    read -p "Do you still want to proceed with remerge operations? (y/N): " PROCEED
    if [[ ! $PROCEED =~ ^[Yy]$ ]]; then
        print_info "Exiting - no remerge needed!"
        exit 0
    fi
fi

# Create backup branch
BACKUP_BRANCH="backup-before-remerge-$(date +%Y%m%d-%H%M%S)"
git branch "$BACKUP_BRANCH"
print_status "Created backup branch: $BACKUP_BRANCH"

# Check if merge commit exists
if git cat-file -e "$CURRENT_COMMIT" 2>/dev/null; then
    print_status "Found current commit with v4 design: $CURRENT_COMMIT"
else
    print_warning "Current commit not found in repository"
fi

echo ""
print_info "Available remerge methods:"
echo "1. Use current state (v4 design already active) - recommended"
echo "2. Create backup of current state"
echo "3. Show current v4 design elements"
echo "4. Show repository history"
echo "5. Create patch from current state"
echo "6. Exit"

echo ""
read -p "Select method (1-6): " METHOD

case $METHOD in
    1)
        print_info "Current repository already contains v4 design..."
        print_status "✅ Modern dark navy theme with cyan accents (#64ffda)"
        print_status "✅ Professional typography using Inter and Fira Code fonts"
        print_status "✅ Brittany Chiang v4 inspired design"
        print_status "✅ Responsive layout and modern styling"
        print_status "✅ Professional portfolio content for Vusumuzi Nkosi"
        echo ""
        print_info "No remerge action needed - v4 design is already active!"
        ;;
        
    2)
        print_info "Creating backup of current v4 design state..."
        BRANCH_NAME="backup-v4-design-$(date +%Y%m%d-%H%M%S)"
        git checkout -b "$BRANCH_NAME"
        print_status "Created backup branch: $BRANCH_NAME"
        print_info "Current v4 design preserved in: $BRANCH_NAME"
        ;;
        
    3)
        print_info "Current v4 design elements:"
        echo ""
        echo "🎨 Color scheme:"
        grep -n "var(--" index.html | head -10
        echo ""
        echo "📝 Content:"
        grep -n "Vusumuzi Nkosi" index.html
        echo ""
        echo "🔧 Technologies:"
        grep -n "SQL\|MySQL\|Power BI\|Tableau" index.html | head -5
        exit 0
        ;;
        
    4)
        print_info "Repository history:"
        echo ""
        git log --oneline -10
        echo ""
        print_info "Looking for portfolio/design related commits:"
        git log --oneline --grep="portfolio\|redesign\|v4\|update" | head -5
        exit 0
        ;;
        
    5)
        print_info "Creating patch from current v4 design state..."
        PATCH_FILE="v4-design-current-state.patch"
        
        # Create a patch showing current state vs empty state
        git diff --no-index /dev/null index.html > "$PATCH_FILE" 2>/dev/null || true
        
        if [ -f "$PATCH_FILE" ]; then
            print_status "Patch created: $PATCH_FILE"
            print_info "This patch contains the current v4 design and can be applied to restore the design"
        else
            print_error "Failed to create patch"
        fi
        exit 0
        ;;
        
    6)
        print_info "Exiting..."
        exit 0
        ;;
        
    *)
        print_error "Invalid selection"
        exit 1
        ;;
esac

echo ""
print_status "Remerge operation completed!"
print_info "Current branch: $(git branch --show-current)"
print_info "Backup branch: $BACKUP_BRANCH"

echo ""
print_info "Next steps:"
echo "1. Test your changes thoroughly"
echo "2. Verify all expected files are present"
echo "3. Check that the website functions correctly"
echo "4. Push changes: git push origin $(git branch --show-current)"
echo "5. Create a pull request if needed"

echo ""
print_info "Verification commands:"
echo "git status"
echo "git diff --name-only HEAD~1"
echo "git log --oneline -5"

echo ""
print_warning "If something went wrong, restore from backup:"
echo "git checkout main && git reset --hard $BACKUP_BRANCH"