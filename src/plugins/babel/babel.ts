import { NodePath, PluginObj } from '@babel/core'
import { ImportDeclaration } from '@babel/types'

import { BabelTypes } from '../../types'
import { LIB_NAME } from '../../config'
import {
    getCallExprFromRefPath,
    getPropertiesMap,
    getCallExprOptions,
    getDynamicImports,
    insertWebpackProp,
    insertModulesProp,
} from './utils'

export default function ({ types }: { types: BabelTypes }): PluginObj {
    return {
        visitor: {
            ImportDeclaration(path: NodePath<ImportDeclaration>) {
                const source = path.node.source.value

                if (source !== LIB_NAME) {
                    return
                }

                const defaultSpecifier = path.get('specifiers').find((specifier) => {
                    return specifier.isImportDefaultSpecifier()
                })

                if (!defaultSpecifier) {
                    return
                }

                const bindingName = defaultSpecifier.node.local.name
                const binding = path.scope.getBinding(bindingName)

                if (!binding) {
                    return
                }

                binding.referencePaths.forEach((refPath) => {
                    const callExpression = getCallExprFromRefPath(refPath)

                    if (!callExpression.isCallExpression()) {
                        return
                    }

                    const options = getCallExprOptions(callExpression)

                    if (!options.isObjectExpression()) {
                        return
                    }

                    const propertiesMap = getPropertiesMap(options)

                    if (propertiesMap.webpack) {
                        return
                    }

                    const dynamicImports = getDynamicImports(propertiesMap)

                    if (!dynamicImports.length) {
                        return
                    }

                    insertWebpackProp({ types, dynamicImports, propertiesMap })
                    insertModulesProp({ types, dynamicImports, propertiesMap })
                })
            },
        },
    }
}
