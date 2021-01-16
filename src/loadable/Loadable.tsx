import { Capture } from './Capture'
import { LoadableMap } from './LoadableMap'
import { createLoadable, load, preloadAll, preloadReady } from './utils'
import { LoadableOptions } from '../types'

const Loadable = (opts: LoadableOptions) => {
    return createLoadable(load, opts)
}

Loadable.preloadAll = preloadAll
Loadable.preloadReady = preloadReady
Loadable.Map = LoadableMap
Loadable.Capture = Capture

export default Loadable
