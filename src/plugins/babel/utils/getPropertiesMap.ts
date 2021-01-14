import reduce from 'lodash/reduce'
import { NodePath } from '@babel/core'
import { Identifier, ObjectExpression, ObjectProperty, SpreadElement } from '@babel/types'

import { PropertiesMap } from '../../../types'

const getPropertiesMap = (options: NodePath<ObjectExpression>): PropertiesMap => {
    const properties = options.get('properties') as NodePath<ObjectProperty | SpreadElement>[]

    return reduce(
        properties,
        (acc, property) => {
            if (property.type === 'SpreadElement') {
                return acc
            }

            const key = property.get('key') as NodePath<Identifier>
            acc[key.node.name] = property

            return acc
        },
        {} as PropertiesMap
    )
}

export { getPropertiesMap }
