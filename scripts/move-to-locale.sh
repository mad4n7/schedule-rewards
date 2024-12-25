#!/bin/bash

# Create locale directory if it doesn't exist
mkdir -p app/[locale]

# Move all directories except api and [locale]
for dir in app/*/; do
  if [[ "$dir" != "app/api/" && "$dir" != "app/[locale]/" ]]; then
    mv "$dir" "app/[locale]/"
  fi
done

# Move all files except layout.tsx and page.tsx in the root app directory
for file in app/*; do
  if [[ -f "$file" && "$file" != "app/layout.tsx" && "$file" != "app/page.tsx" ]]; then
    mv "$file" "app/[locale]/"
  fi
done
