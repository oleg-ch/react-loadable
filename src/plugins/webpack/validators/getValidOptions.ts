import isString from 'lodash/isString'
import isRegExp from 'lodash/isRegExp'
import { WebpackPluginOptions } from '../../../types'

const getValidOptions = (options: WebpackPluginOptions): WebpackPluginOptions => {
    const { filename, exclude = [] } = options || {}

    if (!isString(filename)) {
        throw new Error('Expected filename to be a string')
    }

    if (exclude.length > 0 && !exclude.every(isRegExp)) {
        throw new Error('Expected exclude to be an array of RegExps')
    }

    return { filename, exclude }
}

export { getValidOptions }
