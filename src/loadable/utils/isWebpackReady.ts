/* global __webpack_modules__ */
import isObject from 'lodash/isObject'

const isWebpackReady = (getModuleIds: () => string[]): boolean => {
    // @ts-ignore
    const modules = __webpack_modules__

    if (!isObject(modules as { [name: string]: any })) {
        return false
    }

    return getModuleIds()
        .filter(Boolean)
        .every((id) => modules[id] != null)
}

export { isWebpackReady }
