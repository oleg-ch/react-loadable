import { UserFnInput, LoadingState } from '../../types'

const load = (fn: UserFnInput, shouldThrowOnErr: boolean = false): LoadingState => {
    const state: LoadingState = {
        loading: true,
        loaded: null,
        error: null,
        promise: fn()
            .then((loaded) => {
                state.loading = false
                state.loaded = loaded
                return loaded
            })
            .catch((err) => {
                state.loading = false
                state.error = err

                if (shouldThrowOnErr) {
                    throw err
                }
            }),
    }

    return state
}

export { load }
