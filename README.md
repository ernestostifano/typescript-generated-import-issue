
# Issue Description

---

Import statements for ***"indirectly referenced"*** type definitions in emitted declaration files seem to be inconsistent
or even broken under certain circumstances.

**What do I intend for ***"indirectly referenced"***?**

```ts
import type {IMyInterface} from './some/file.ts';

function myFunction(): IMyInterface {
    return {};
}

export {myFunction};
```

`IMyInterface` is ***"indirectly referenced"*** wherever `myFunction` is consumed.

**There are four examples in this monorepo**, each one represents a different approach to achieve
the same goal, but different results are obtained as follows.

Each example consists in a package exporting a typed function and a package importing it.
**The issue is to be searched in declaration files generated for the importing package.**



# Reproduction Steps

---

- `yarn`
- `yarn run build`



# Examples

---

## Example `A` - `BAD`

### `@scope/package-a-export`

***defines/types.ts***
```ts
interface IEntity {
    propA: string
    propB: number
    propC: boolean
}

export type {IEntity};
```

***utils/create-entity.ts***
```ts
import type {IEntity} from "../../defines/types";

function createEntity(): IEntity {
    return {
        propA: '',
        propB: 0,
        propC: false
    }
}

export {createEntity};
```

***index.ts***
```ts
import {createEntity} from "./utils/create-entity";
import type {IEntity} from "./defines/types";

export {createEntity};
export type {IEntity};
```

### `@scope/package-a-import`

***index.ts***
```ts
import {createEntity} from '@scope/package-a-export';

const entity = createEntity();

export {entity};
```

### `RESULT`

***types/index.d.ts***
```ts
declare const entity: import("../../package-a-export/types/defines/types").IEntity;
export { entity };
//# sourceMappingURL=index.d.ts.map
```

**The following statement `import("../../package-a-export/types/defines/types")` is broken. Will only work locally, but not
if the package is installed elsewhere.**



## Example `B` - `NOT SO BAD`

### `@scope/package-b-export`

***index.ts***
```ts
interface IEntity {
    propA: string
    propB: number
    propC: boolean
}

function createEntity(): IEntity {
    return {
        propA: '',
        propB: 0,
        propC: false
    }
}

export {createEntity};
export type {IEntity};
```

### `@scope/package-b-import`

***index.ts***
```ts
import {createEntity} from '@scope/package-b-export';

const entity = createEntity();

export {entity};
```

### `RESULT`

***types/index.d.ts***
```ts
declare const entity: import("@scope/package-b-export").IEntity;
export { entity };
//# sourceMappingURL=index.d.ts.map
```

**The following statement `import("@scope/package-b-export")` works, even if a static import would be preferred.**



## Example `C` - `NOT SO BAD`

### `@scope/package-c-export`

***defines/types.ts***
```ts
interface IEntity {
    propA: string
    propB: number
    propC: boolean
}

export type {IEntity};
```

***utils/create-entity.ts***
```ts
import type {IEntity} from "../../defines/types";

function createEntity(): IEntity {
    return {
        propA: '',
        propB: 0,
        propC: false
    }
}

export {createEntity};
```

***index.ts***
```ts
import {createEntity} from "./utils/create-entity";
import type {IEntity} from "./defines/types";

export {createEntity};
export type {IEntity};
```

### `@scope/package-c-import`

***index.ts***
```ts
import {createEntity} from '@scope/package-c-export';
import type {IEntity} from '@scope/package-c-export';

const entity = createEntity();

export {entity};
export type {IEntity};
```

### `RESULT`

***types/index.d.ts***
```ts
import type { IEntity } from '@scope/package-c-export';
declare const entity: IEntity;
export { entity };
export type { IEntity };
//# sourceMappingURL=index.d.ts.map
```

**The following statement `import type { IEntity } from '@scope/package-c-export';` is ideal, but
the mean to achieve it (at `index.ts`) is not.**



## Example `D` - `BAD`

### `@scope/package-d-export`

***defines/types.ts***
```ts
interface IEntity {
    propA: string
    propB: number
    propC: boolean
}

export type {IEntity};
```

***utils/create-entity.ts***
```ts
import type {IEntity} from "../defines/types";

function createEntity(): IEntity {
    return {
        propA: '',
        propB: 0,
        propC: false
    }
}

export {createEntity};
export type {IEntity};
```

***index.ts***
```ts
import {createEntity} from "./utils/create-entity";
import type {IEntity} from "./defines/types";

export {createEntity};
export type {IEntity};
```

### `@scope/package-d-import`

***index.ts***
```ts
import {createEntity} from '@scope/package-d-export';

const entity = createEntity();

export {entity};
```

### `RESULT`

***types/index.d.ts***
```ts
declare const entity: import("../../package-d-export/types/defines/types").IEntity;
export { entity };
//# sourceMappingURL=index.d.ts.map
```

**The following statement `import("../../package-d-export/types/defines/types")` is broken. Will only work locally, but not
if the package is installed elsewhere.**
