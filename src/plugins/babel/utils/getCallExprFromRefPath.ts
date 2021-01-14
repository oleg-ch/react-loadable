import { NodePath } from '@babel/core'

const getCallExprFromRefPath = (referencePath: NodePath): NodePath => {
    const callExpression = referencePath.parentPath

    if (
        callExpression.isMemberExpression() &&
        callExpression.node.computed === false &&
        // @ts-ignore
        callExpression.get('property').isIdentifier({ name: 'Map' })
    ) {
        return callExpression.parentPath
    }

    return callExpression
}

export { getCallExprFromRefPath }
