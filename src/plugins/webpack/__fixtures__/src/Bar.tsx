import React from 'react'
import { Foo } from './components/Foo'

class Bar extends React.Component {
    render() {
        return (
            <div>
                <span>Bar component</span>
                <Foo />
            </div>
        )
    }
}

export { Bar }
