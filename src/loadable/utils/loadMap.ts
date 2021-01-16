import reduce from 'lodash/reduce'
import { load } from './load'
import { UserFnMapInput, LoadingMapState } from '../../types'

const loadMap = (map: UserFnMapInput): LoadingMapState => {
    const state: Omit<LoadingMapState, 'promise'> & { [name: string]: any } = {
        loading: true,
        loaded: {},
        error: null,
    }

    const promises = reduce(
        map,
        (acc, val, key) => {
            const result = load(val, true)

            const promise = result.promise
                .then((loaded) => {
                    state.loaded[key] = loaded
                    return loaded
                })
                .catch((err) => {
                    state.loaded[key] = null
                    state.error = err
                })

            acc.push(promise)

            return acc
        },
        [] as Promise<any>[]
    )

    state.promise = Promise.all(promises)
        .then((results) => {
            state.loading = false
            return results
        })
        .catch((err) => {
            state.loading = false
            state.error = err
        })

    return state as LoadingMapState
}

export { loadMap }
