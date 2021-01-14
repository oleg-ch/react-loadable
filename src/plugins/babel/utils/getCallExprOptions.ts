import { NodePath } from '@babel/traverse'
import { CallExpression } from '@babel/types'

import { NodePathArgument } from '../../../types'

const getCallExprOptions = (callExpression: NodePath<CallExpression>): NodePathArgument => {
    const args = callExpression.get('arguments') as NodePathArgument[]

    if (args.length !== 1) {
        throw new Error('Loadable is expected to be called with one argument')
    }

    return args[0] as NodePathArgument
}

export { getCallExprOptions }
