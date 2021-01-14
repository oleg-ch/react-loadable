import { fingerprint } from '@oleg-ch/build-utils'
import { Compiler, Compilation, sources } from 'webpack'

import { WebpackPluginOptions } from '../../types'
import { WEBPACK_PLUGIN_NAME, DEFAULT_FILENAME, DEFAULT_EXT } from '../../config'
import { buildManifest } from './utils'
import { getValidOptions } from './validators'

class ReactLoadablePlugin {
    options: WebpackPluginOptions

    constructor(options: WebpackPluginOptions) {
        this.options = getValidOptions(options)
    }

    apply(compiler: Compiler) {
        compiler.hooks.thisCompilation.tap(WEBPACK_PLUGIN_NAME, (compilation) => {
            compilation.hooks.processAssets.tapPromise(
                {
                    name: WEBPACK_PLUGIN_NAME,
                    stage: Compilation.PROCESS_ASSETS_STAGE_REPORT,
                },
                async () => {
                    await this.emitManifest({ compilation, compiler })
                }
            )
        })
    }

    async emitManifest(params: { compiler: Compiler; compilation: Compilation }) {
        const { compiler, compilation } = params
        const { exclude } = this.options

        const manifest = buildManifest({ compiler, compilation, exclude })
        const filename = this.getFilename(manifest)
        const source = new sources.RawSource(manifest)
        const asset = compilation.getAsset(filename)

        if (asset) {
            compilation.updateAsset(filename, source)
            return
        }

        compilation.emitAsset(filename, source)
    }

    getFilename(source: string): string {
        return this.options.filename
            .replace('[name]', DEFAULT_FILENAME)
            .replace('[ext]', DEFAULT_EXT)
            .replace('[contenthash]', fingerprint(source))
    }
}

export { ReactLoadablePlugin }
