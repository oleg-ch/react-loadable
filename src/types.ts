import { NodePath } from '@babel/traverse'
import * as Babel from '@babel/types'
import { Expression, ObjectProperty, SpreadElement } from '@babel/types'
import React from 'react'

/** -------- Babel -------- */
export type PropertiesMap = {
    [name: string]: NodePath<ObjectProperty | SpreadElement>
}

export type NodePathArgument = NodePath<Expression | SpreadElement>
export type BabelTypes = typeof Babel

/** -------- Webpack -------- */
export type WebpackPluginOptions = {
    filename: string
    exclude: RegExp[]
}

export type BuildManifestItem = {
    id: string | number
    name: string | null
    file: string
    publicPath: string
}

export type BuildManifest = { [name: string]: BuildManifestItem[] }
export type WpStatsJson = { assets: { [name: string]: any }[] }

/** -------- Loadable -------- */
export type UserFnInput = (...args: any[]) => Promise<any>
export type UserFnMapInput = { [name: string]: UserFnInput }

export type LoadFn = (fn: UserFnInput) => LoadingState
export type LoadMapFn = (map: UserFnMapInput) => LoadingMapState

export type Initializer = () => Promise<any>

export type LoadableOptions = {
    loader: UserFnInput | UserFnMapInput
    loading: React.ComponentType
    render?: (...args: any[]) => any
    delay?: number
    timeout?: number
    webpack?: () => string[]
    modules?: string[]
}

export type LoadableInternalOptions = Omit<LoadableOptions, 'render' | 'delay' | 'webpack'> & {
    render: (...args: any[]) => any
    delay: number
    webpack: () => string[]
    loader: UserFnInput | UserFnMapInput
}

export type LoadableState = {
    pastDelay: boolean
    timedOut: boolean
    error: any
    loading: any
    loaded: any
}

export type LoadingState = {
    loading: boolean
    loaded: any
    error: any
    promise: Promise<any>
}

export type LoadingMapState = {
    loading: boolean
    loaded: { [name: string]: any }
    error: any
    promise: Promise<any>
}

export type LoadingProps = {
    isLoading: boolean
    pastDelay: boolean
    timedOut: boolean
    error: any
    retry: () => any
}

export type LoadableContextType = {
    loadable?: { report: (mod: any) => void }
}

export interface ICaptureProps {
    report: (mod: any) => void
    children: any
}
