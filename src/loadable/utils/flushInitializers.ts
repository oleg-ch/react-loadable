import { Initializer } from '../../types'

const flushInitializers = (initializers: Initializer[]): Promise<any> => {
    const promises: Promise<any>[] = []

    while (initializers.length) {
        const init = initializers.pop()

        if (init) {
            promises.push(init())
        }
    }

    return Promise.all(promises).then(() => {
        if (initializers.length) {
            return flushInitializers(initializers)
        }

        return null
    })
}

export { flushInitializers }
