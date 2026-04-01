# TypeScript Coding Standards

## Code Style

```typescript
// ✅ Spaces inside `{}` in imports, types, objects, destructuring
import { Data } from './data';
type Id = { id: string };
const { signal } = new AbortController();

// ✅ Single quotes; template literals for interpolation
import { atom } from 'nanostores';
const msg = `Hello, ${name}`;

// ✅ Check for both null and undefined with `!= null`
if (response != null) { /* safe */ }

// ✅ Modern syntax: optional chaining, nullish coalescing, logical assignment
const len = items?.length ?? 0;
settings.debug ||= false;
const size = 1_000_000;

// ✅ Prefer const; use destructuring
const max = 100;
const [body, headers = {}] = request;

// ✅ Single-line guard clauses without braces
if (element == null) return;
if (!isSupported) return false;

// ✅ One blank line between logically distinct operations
const result = doSomething();

updateAnotherThing();
```

## Naming

```typescript
// ✅ Booleans: is/has/can/should/will prefixes for standalone variables
const isEnabled = true;
const hasFocus = false;
const canEdit = permissions.includes('edit');

// ✅ Internal handlers: handle prefix; callbacks/props: on prefix
const handleClick = () => { onClick?.(); };
const handleSubmit = (e: Event) => { e.preventDefault(); };

// ✅ Functions: verb prefixes
function getUserById(id: string) {}   // get/fetch/load/parse
function setUserName(name: string) {} // set/update/save
function isValidEmail(email: string): boolean {} // is/has for boolean returns

// ✅ Arrays: plural forms
const users: User[] = [];
const selectedIds: string[] = [];

// ✅ Constants: UPPER_SNAKE_CASE
const TIMEOUT_MS = 30_000;
const MAX_RETRIES = 3;

// ✅ Trailing comma in multi-line signatures
function add(
  a: number,
  b: number,
): number { /* ... */ }
```

## Type Definitions

```typescript
// ✅ Prefer type over interface
type User = {
  id: string;
  name: string;
};

// ✅ T[] syntax for arrays, never Array<T>
type Users = User[];
const items: string[] = [];

// ✅ Avoid any — use unknown with type guards
const data: unknown = fetchData();
if (isUser(data)) { /* data is User */ }

// ✅ Avoid as assertions and non-null !
// ❌ const user = {} as User;
// ❌ const value = getInput()!;
// ✅ Use type guards or guard clauses instead

// ✅ Prefer undefined over null for optional values
const [activeId, setActiveId] = [undefined, () => {}] as [string | undefined, (v: string) => void];

// ✅ Use satisfies for precise literal types without widening
const options = {
  retry: 3,
  timeout: 5000,
} satisfies RequestOptions;

// ✅ Define Maybe<T> for nullish values
type Maybe<T> = T | null | undefined;
```

## Type Composition

```typescript
// ✅ Regular imports for types; avoid inline dynamic imports
import { SomeType } from './types';

// ✅ Composition over subtraction — single-level Omit is fine, nested is a smell
type OwnProps = { id?: string; disabled?: boolean };
type FullProps = OwnProps & InjectedDeps;
export type PublicProps = OwnProps; // not Omit<FullProps, keyof InjectedDeps>
```

## Function Signatures

```typescript
// ✅ Explicit return types for exported functions
export function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ✅ Arrow functions for one-liners
const isEven = (n: number): boolean => n % 2 === 0;

// ✅ Generic constraints
function updateEntity<T extends { id: string }>(entity: T, updates: Partial<T>): T {
  return { ...entity, ...updates };
}
```

## Error Handling

```typescript
// ✅ Result pattern for unsafe operations
async function parse(data: string): Promise<Result<User>> {
  return Result.tryCatch(() => JSON.parse(data));
}
```

## Imports

```typescript
// ✅ Named exports preferred
export { ServiceA, ServiceB };

// ✅ Group: external → internal → types
import { something } from 'external-lib';

import { helper } from '../utils/helper';
import { sibling } from './sibling';

import type { User } from '../types';
```
