import React from 'react'
import { LoadableContextType, ICaptureProps } from '../types'
import { LoadableContext } from './LoadableContext'

const Capture: React.FC<ICaptureProps> = (props: ICaptureProps) => {
    const value: LoadableContextType = { loadable: { report: props.report } }

    return (
        <LoadableContext.Provider value={value}>
            {React.Children.only(props.children)}
        </LoadableContext.Provider>
    )
}

export { Capture }
