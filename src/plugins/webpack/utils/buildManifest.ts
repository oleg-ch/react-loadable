import url from 'url'
import { Compiler, Compilation } from 'webpack'

import { BuildManifest } from '../../../types'
import { getCurrentModule } from './getCurrentModule'

type BuildManifestParams = {
    compiler: Compiler
    compilation: Compilation
    exclude: RegExp[]
}

const buildManifest = (params: BuildManifestParams): string => {
    const { compiler, compilation, exclude } = params
    const context = compiler.options.context as string
    const publicPath = compilation.outputOptions.publicPath as string
    const manifest: BuildManifest = {}

    const { chunkGraph } = compilation

    if (!chunkGraph) {
        throw new Error('Webpack compilation chunkGraph is unavailable')
    }

    compilation.chunks.forEach((chunk) => {
        chunk.files.forEach((filename) => {
            chunkGraph.getChunkModules(chunk).forEach((module) => {
                const id = chunkGraph.getModuleHash(module, chunk.runtime)
                const name = module.libIdent({ context })
                const modulePath = url.resolve(publicPath || '', filename)
                const currentModule = getCurrentModule(module)

                const shouldExclude = exclude.some((pattern) =>
                    pattern.test(currentModule.rawRequest)
                )

                if (shouldExclude) {
                    return
                }

                if (!manifest[currentModule.rawRequest]) {
                    manifest[currentModule.rawRequest] = []
                }

                manifest[currentModule.rawRequest].push({
                    id,
                    name,
                    file: filename,
                    publicPath: modulePath,
                })
            })
        })
    })

    return JSON.stringify(manifest)
}

export { buildManifest }
