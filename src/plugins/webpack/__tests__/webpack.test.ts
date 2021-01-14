import { fs } from 'memfs'
import webpack, { Configuration } from 'webpack'
import { resolvePath } from '@oleg-ch/build-utils'
import { ReactLoadablePlugin } from '../webpack'
import { WpStatsJson } from '../../../types'

const paths = {
    ROOT: resolvePath(),
    NODE_MODULES: resolvePath('node_modules'),
    SRC: resolvePath('src/plugins/webpack/__fixtures__/src'),
    DIST: resolvePath('src/plugins/webpack/__fixtures__/dist'),
    OUT_FILE: 'loadables.[contenthash].json',
}

const wpConfig = {
    entry: {
        app: [paths.SRC],
    },
    output: {
        path: paths.DIST,
        publicPath: '/',
    },
    resolve: {
        modules: [paths.NODE_MODULES, paths.SRC],
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    },
    stats: { preset: 'verbose' },
    mode: 'development',
    context: paths.ROOT,
    module: {
        rules: [
            {
                test: /\.(js|jsx|mjs|ts|tsx)$/,
                include: paths.SRC,
                exclude: /\.(spec|test)\.(js|jsx|ts|tsx)$/,
                use: [
                    {
                        loader: require.resolve('babel-loader'),
                        options: {
                            cacheDirectory: true,
                            cacheCompression: false,
                        },
                    },
                ],
            },
        ],
    },
    plugins: [new ReactLoadablePlugin({ filename: paths.OUT_FILE, exclude: [] })],
}

describe('Webpack plugin tests', () => {
    it('Can create loadables asset file', async () => {
        const compiler = webpack(wpConfig as Configuration)
        // @ts-ignore
        compiler.outputFileSystem = fs

        const json: WpStatsJson = await new Promise((resolve) => {
            compiler.run((err, stats) => {
                if (err) {
                    throw err
                }

                // @ts-ignore
                resolve(stats.toJson())
            })
        })

        const re = /^loadables\.(.)+\.json/
        const loadables = json.assets.find((asset) => re.test(asset.name))

        expect(loadables).toBeDefined()
    })
})
