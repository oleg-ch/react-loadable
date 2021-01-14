import map from 'lodash/map'
import { NodePath } from '@babel/traverse'
import { BabelTypes, NodePathArgument, PropertiesMap } from '../../../types'

const insertWebpackProp = ({
    types: t,
    dynamicImports,
    propertiesMap,
}: {
    types: BabelTypes
    dynamicImports: NodePath[]
    propertiesMap: PropertiesMap
}): void => {
    const resolvers = map(dynamicImports, (dynamicImport) => {
        const importArgs = dynamicImport.get('arguments') as NodePathArgument[]

        return t.callExpression(
            t.memberExpression(t.identifier('require'), t.identifier('resolveWeak')),
            [importArgs[0].node]
        )
    })

    propertiesMap.loader.insertAfter(
        t.objectProperty(
            t.identifier('webpack'),
            t.arrowFunctionExpression([], t.arrayExpression(resolvers))
        )
    )
}

export { insertWebpackProp }
