#!/bin/bash

# Fix Task model properties
find src -name "*.spec.ts" -type f -exec sed -i '' \
  -e 's/TaskStatus\.TODO/'"'"'todo'"'"'/g' \
  -e 's/TaskStatus\.IN_PROGRESS/'"'"'in_progress'"'"'/g' \
  -e 's/TaskStatus\.DONE/'"'"'done'"'"'/g' \
  -e 's/TaskStatus\.DELAYED/'"'"'delayed'"'"'/g' \
  -e 's/TaskPriority\.LOW/'"'"'low'"'"'/g' \
  -e 's/TaskPriority\.MEDIUM/'"'"'medium'"'"'/g' \
  -e 's/TaskPriority\.HIGH/'"'"'high'"'"'/g' \
  -e 's/username:/name:/g' \
  -e 's/assigneeId:/assignedToId:/g' \
  -e 's/creatorId:/createdById:/g' \
  -e "s/createdAt: '\\([^']*\\)'/createdAt: new Date('\\1')/g" \
  -e "s/updatedAt: '\\([^']*\\)'/updatedAt: new Date('\\1')/g" \
  -e '/description:/d' \
  {} \;

echo "Type fixes applied successfully"
