import React from 'react'

const resolve = (source: { __esModule?: boolean; default: any }): any => {
    return source && source.__esModule ? source.default : source
}

const render = (loaded: any, props: object) => {
    const LoadedComp = resolve(loaded)

    return <LoadedComp {...props} />
}

export { render }
