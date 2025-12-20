---
description: Validate personal information consistency across project files that cannot be auto-generated
user_invocable: true
---

# Validate Personal Info

Check that personal information in manually-maintained files is consistent with the source of truth in `src/data.ts`.

## Source of Truth

Read `src/data.ts` to extract:
- `name` + `surname` = full name
- `nickname`
- `email`
- `domain`

## Files to Validate

### 1. package.json
Check the `author` field matches the full name and email:
- Expected format: `"Mikita Taukachou <edloidas@gmail.com>"`

### 2. LICENSE
Check copyright holder matches the full name:
- Look for line containing `Copyright` and verify the name

### 3. README.md
Check attribution matches:
- Look for the full name in copyright/attribution section

### 4. public/CNAME
Check domain matches `data.domain`:
- File should contain just the domain (e.g., `edloidas.io`)

## Validation Process

1. Read `src/data.ts` and extract the personal data values
2. Read each file listed above
3. For each file, check if the expected values match
4. Report findings

## Output Format

If all files are consistent:
```
All personal information is consistent with src/data.ts.
```

If inconsistencies found:
```
Found N inconsistency(ies):

package.json:5
  author: expected "Name <email>", found "..."

LICENSE:3
  copyright: expected "Name", found "..."
```
