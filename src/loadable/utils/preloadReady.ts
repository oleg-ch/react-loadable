import { flushInitializers } from './flushInitializers'
import { READY_INITIALIZERS } from '../../config'

const preloadReady = (): Promise<void> => {
    return new Promise((resolve) => {
        // We always will resolve, errors should be handled within loading UIs.
        flushInitializers(READY_INITIALIZERS).then(resolve, resolve)
    })
}

export { preloadReady }
