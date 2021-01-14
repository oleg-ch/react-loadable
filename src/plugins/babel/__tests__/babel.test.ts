// @ts-ignore
import * as babel from '@babel/core'

import ReactLoadablePlugin from '../index'
import { LIB_NAME } from '../../../config'

describe('Babel plugin tests', () => {
    it('Can inject required properties to options object', () => {
        const example = `
            import Loadable from '${LIB_NAME}'
            
            const HomePage = Loadable.Map({
                loader: () => import('../Home.js')
            })
        `
        // @ts-ignore
        const { code } = babel.transform(example, {
            presets: ['@babel/preset-env'],
            plugins: [ReactLoadablePlugin],
        })

        expect(code).toMatchSnapshot()
    })
})
