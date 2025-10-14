#!/bin/bash

# This script validates that commit messages follow the format:
# type(#issue_number): description (keyword #issue_number)

BASE_SHA=$1
HEAD_SHA=$2
NULL_SHA="0000000000000000000000000000000000000000"

# Regex to validate the commit message format.
REGEX="^(feat|fix|docs|chore)\(#([0-9]+)\): .+ \((close|closes|closed|fix|fixes|fixed|resolve|resolves|resolved) #\2\)$"
HAS_ERROR=0
COMMIT_RANGE=""

# Handle the case of a new branch push, where BASE_SHA is a null SHA.
if [ "$BASE_SHA" == "$NULL_SHA" ]; then
  echo "--> New branch detected. Validating all commits on this branch."
  # In this case, we validate all commits up to the HEAD of the new branch.
  COMMIT_RANGE="$HEAD_SHA"
else
  echo "--> Validating commits in range: ${BASE_SHA:0:7}..${HEAD_SHA:0:7}"
  COMMIT_RANGE="$BASE_SHA..$HEAD_SHA"
fi

# Get the list of commit message subjects from the calculated range.
COMMIT_MSGS=$(git log --format=%s "$COMMIT_RANGE")

# Check if there are any new commits to validate.
if [ -z "$COMMIT_MSGS" ]; then
  echo "--> No new commits to validate."
  exit 0
fi

# Loop through each commit message and validate it.
while IFS= read -r msg; do
  if [[ ! "$msg" =~ $REGEX ]]; then
    echo "❌ ERROR: Invalid commit message -> '$msg'"
    HAS_ERROR=1
  else
    echo "✅ OK: $msg"
  fi
done <<< "$COMMIT_MSGS"

# If an error was found, exit with a non-zero status code.
if [ "$HAS_ERROR" -ne 0 ]; then
  echo "-----------------------------------------------------------"
  echo "❌ One or more commit messages have an invalid format."
  echo "   Expected format: 'type(#number): description (keyword #number)'"
  echo "   Valid keywords: close(s/d), fix(es/ed), resolve(s/d)."
  echo "   To fix this, use 'git rebase -i' and force-push your changes."
  exit 1
fi

echo "🎉 All pushed commit messages are valid!"
exit 0