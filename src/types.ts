import { NodePath } from '@babel/traverse'
import * as Babel from '@babel/types'
import { Expression, ObjectProperty, SpreadElement } from '@babel/types'

export type PropertiesMap = {
    [name: string]: NodePath<ObjectProperty | SpreadElement>
}

export type NodePathArgument = NodePath<Expression | SpreadElement>

export type BabelTypes = typeof Babel

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
