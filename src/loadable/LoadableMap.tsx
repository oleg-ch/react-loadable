import isFunction from 'lodash/isFunction'
import { loadMap, createLoadable } from './utils'
import { LoadableOptions } from '../types'

const LoadableMap = (opts: LoadableOptions) => {
    if (isFunction(opts.render)) {
        return createLoadable(loadMap, opts, true)
    }

    throw new Error('Loadable.Map requires a "render(loaded, props)" function')
}

export { LoadableMap }
