# Task Workflow

## 1. Creating a Task

Always create an Issue for any new task, bug, or idea (small changes can be done without).

**Format:**
- Short title
- Detailed description (user story or what needs to be done)
- Labels (type, status, priority)
- Assignee (who is responsible)

## 2. Using Labels

### Task Types
- `bug🐞` — marks an error or malfunction in the code
- `feature✨` — task for developing new functionality
- `documentation📝` — updating or creating documentation
- `ui/ux🎨` — tasks related to interface and design

### Status
- `in progress🚧` — task is currently being worked on
- `done✅` — task is completed
- `waiting⏳` — waiting for clarifications or depends on another task

### Priority
- `high priority🔴` — critically important task
- `medium priority🟡` — task of medium importance
- `low priority🟢` — low priority task

### Roles
- `user👤` — functionality or task for user role
- `admin🛠` — task for administrator or manager

## 3. Executing a Task

- When starting work — set the `in progress` label.
- Create a branch in Git: `feature/<short-name>` or `bugfix/<short-name>`.
- Work on the code.

## 4. Pull Request

- When the task is ready → open a Pull Request.
- In the PR, reference the Issue:
  ```
  Closes #5
  ```
  (This will automatically close the Issue after merging).
- In the PR, you can describe what changed.
