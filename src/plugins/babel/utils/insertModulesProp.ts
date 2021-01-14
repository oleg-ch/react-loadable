import map from 'lodash/map'
import { NodePath } from '@babel/traverse'
import { BabelTypes, NodePathArgument, PropertiesMap } from '../../../types'

const insertModulesProp = ({
    types: t,
    dynamicImports,
    propertiesMap,
}: {
    types: BabelTypes
    dynamicImports: NodePath[]
    propertiesMap: PropertiesMap
}): void => {
    const modules = map(dynamicImports, (dynamicImport) => {
        const importArgs = dynamicImport.get('arguments') as NodePathArgument[]

        return importArgs[0].node
    })

    propertiesMap.loader.insertAfter(
        t.objectProperty(t.identifier('modules'), t.arrayExpression(modules))
    )
}

export { insertModulesProp }
