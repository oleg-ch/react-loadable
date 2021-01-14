import { NodePath } from '@babel/traverse'
import { PropertiesMap } from '../../../types'

const getDynamicImports = (propertiesMap: PropertiesMap): NodePath[] => {
    const loaderMethod = propertiesMap.loader.get('value') as NodePath
    const dynamicImports: NodePath[] = []

    loaderMethod.traverse({
        Import(path) {
            dynamicImports.push(path.parentPath)
        },
    })

    return dynamicImports
}

export { getDynamicImports }
