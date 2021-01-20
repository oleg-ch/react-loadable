// eslint-disable-next-line max-classes-per-file
import React, { Component } from 'react'
import isArray from 'lodash/isArray'
import isFunction from 'lodash/isFunction'
import isNumber from 'lodash/isNumber'
import assign from 'lodash/assign'

import {
    LoadFn,
    LoadMapFn,
    LoadableInternalOptions,
    LoadableState,
    LoadingProps,
    LoadingState,
    LoadableOptions,
    LoadingMapState,
    UserFnMapInput,
    UserFnInput,
    LoadableContextType,
} from '../../types'
import { ALL_INITIALIZERS, READY_INITIALIZERS } from '../../config'
import { LoadableContext } from '../LoadableContext'
import { isWebpackReady } from './isWebpackReady'
import { render } from './render'

const createLoadable = (fn: LoadFn | LoadMapFn, options: LoadableOptions, isMap?: boolean) => {
    if (!options.loading) {
        throw new Error('react-loadable requires a "loading" component')
    }

    const opts: LoadableInternalOptions = assign(
        {
            render,
            delay: 200,
            loader: null,
            loading: null,
            timeout: null,
            webpack: null,
            modules: null,
        },
        options
    )

    let res: LoadingState | LoadingMapState

    const assignRes = () => {
        res = isMap
            ? (fn as LoadMapFn)(opts.loader as UserFnMapInput)
            : (fn as LoadFn)(opts.loader as UserFnInput)
    }

    const init = () => {
        if (!res) {
            assignRes()
        }

        return res.promise
    }

    ALL_INITIALIZERS.push(init)

    if (isFunction(opts.webpack)) {
        READY_INITIALIZERS.push(() => {
            if (isWebpackReady(opts.webpack)) {
                return init()
            }

            return Promise.resolve()
        })
    }

    class LoadableComp extends Component<{}, LoadableState> {
        _mounted: boolean = false

        _delay: any

        _timeout: any

        constructor(props: any, context: any) {
            super(props, context)

            // noinspection JSIgnoredPromiseFromCall
            init()

            this.state = {
                pastDelay: false,
                timedOut: false,
                error: res.error,
                loading: res.loading,
                loaded: res.loaded,
            }

            this._loadModule()
        }

        static contextType = LoadableContext as React.Context<LoadableContextType>

        static preload() {
            return init()
        }

        componentDidMount() {
            this._mounted = true
        }

        componentWillUnmount() {
            this._mounted = false
            this._clearTimeouts()
        }

        _setStateOnMounted = (nextState: any) => {
            if (!this._mounted) {
                return
            }

            this.setState(nextState)
        }

        _update = () => {
            this._setStateOnMounted({
                error: res.error,
                loaded: res.loaded,
                loading: res.loading,
            })

            this._clearTimeouts()
        }

        _processDelay() {
            if (!isNumber(opts.delay)) {
                return
            }

            // It is safe to update state property directly here, because
            // current fn is expected to be executed inside constructor only
            if (opts.delay === 0) {
                // @ts-ignore
                this.state.pastDelay = true
                return
            }

            // TODO: do nothing if it is SSR
            this._delay = setTimeout(() => {
                this._setStateOnMounted({ pastDelay: true })
            }, opts.delay)
        }

        _processTimeout() {
            if (!isNumber(opts.timeout)) {
                return
            }

            // TODO: do nothing if it is SSR
            this._timeout = setTimeout(() => {
                this._setStateOnMounted({ timedOut: true })
            }, opts.timeout)
        }

        _loadModule() {
            if (
                this.context &&
                this.context.loadable &&
                isFunction(this.context.loadable.report) &&
                isArray(opts.modules)
            ) {
                opts.modules.forEach((moduleName) => {
                    this.context.loadable.report(moduleName)
                })
            }

            if (!res.loading) {
                return
            }

            this._processDelay()
            this._processTimeout()

            // catch clause isn't really required here since all loading errors
            // are swallowed earlier
            res.promise.then(this._update)
        }

        _clearTimeouts() {
            clearTimeout(this._delay)
            clearTimeout(this._timeout)
            this._delay = undefined
            this._timeout = undefined
        }

        _retry = () => {
            assignRes()
            this.setState({ loading: res.loading, error: null, timedOut: false })
            this._loadModule()
        }

        render() {
            if (this.state.loading || this.state.error) {
                const Loading = opts.loading as React.ComponentType<LoadingProps>

                return (
                    <Loading
                        isLoading={this.state.loading}
                        pastDelay={this.state.pastDelay}
                        timedOut={this.state.timedOut}
                        error={this.state.error}
                        retry={this._retry}
                    />
                )
            }

            if (this.state.loaded) {
                return opts.render(this.state.loaded, this.props)
            }

            return null
        }
    }

    return LoadableComp as React.ComponentType<any>
}

export { createLoadable }
