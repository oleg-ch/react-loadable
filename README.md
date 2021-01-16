# react-loadable

This is still our well-loved [React-loadable](https://www.npmjs.com/package/react-loadable), thus its API and docs remain valid.

Some of the changes include:

-   webpack plugin was updated and is compatible with Webpack 5
-   babel plugin is compatible with Babel 7
-   added basic tests for webpack & babel plugins
-   required React version is now 17
-   all React deprecations have been removed
-   there are two builds now: esm & cjs, + ts types

TODO:

-   probably should add support for Webpack 4 as well

Installation:

```
npm i @oleg-ch/react-loadable
yarn add @oleg-ch/react-loadable
```

Usage:

```
import Loadable from '@oleg-ch/react-loadable'
```

Webpack:

```
import { ReactLoadablePlugin } from '@oleg-ch/react-loadable/cjs/webpack'
import { getBundles } from '@oleg-ch/react-loadable/cjs/webpack'
```

Babel:

```
{
    plugins: [
        '@oleg-ch/react-loadable/cjs/babel'
    ]
}
```
