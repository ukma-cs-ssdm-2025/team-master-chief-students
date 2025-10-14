#!/bin/bash

BASE_SHA=$1
HEAD_SHA=$2

REGEX="^(feat|fix|docs|chore)\(#([0-9]+)\): .+ \(closes|fixes|resolves #\2\)$"

HAS_ERROR=0

echo "--> Validating commits in range: ${BASE_SHA:0:7}..${HEAD_SHA:0:7}"

COMMIT_MSG_LIST=$(git log --format=%s "$BASE_SHA..$HEAD_SHA")

if [ -z "$COMMIT_MSG_LIST" ]; then
  echo "--> No new commits to validate."
  exit 0
fi

while IFS= read -r msg; do
  if [[ ! "$msg" =~ $REGEX ]]; then
    echo "❌ ERROR: Invalid commit message -> '$msg'"
    HAS_ERROR=1
  else
    echo "✅ OK: $msg"
  fi
done <<< "$COMMIT_MSG_LIST"

if [ "$HAS_ERROR" -ne 0 ]; then
  echo "-----------------------------------------------------------"
  echo "❌ One or more commit messages have an invalid format."
  echo "   Expected format: 'type(#number): description (keyword #number)'"
  echo "   Valid keywords: closes, fixes, resolves."
  echo "   To fix this, use 'git rebase -i' and force-push your changes."
  exit 1
fi

echo "🎉 All pushed commit messages are valid!"
exit 0