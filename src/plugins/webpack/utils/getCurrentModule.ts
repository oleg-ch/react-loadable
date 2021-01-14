import { Module } from 'webpack'

type ChunkModule = Module & { rawRequest: string }

const getCurrentModule = (module: Module): ChunkModule => {
    if (module.constructor.name === 'ConcatenatedModule') {
        // @ts-ignore
        return module.rootModule as ChunkModule
    }

    return module as ChunkModule
}

export { getCurrentModule }
