import { flushInitializers } from './flushInitializers'
import { ALL_INITIALIZERS } from '../../config'

const preloadAll = () => {
    return new Promise((resolve, reject) => {
        flushInitializers(ALL_INITIALIZERS).then(resolve, reject)
    })
}

export { preloadAll }
