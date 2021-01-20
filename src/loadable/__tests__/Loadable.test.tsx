import React from 'react'
import renderer from 'react-test-renderer'

import Loadable from '../Loadable'

const waitFor = (delay: any) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay)
    })
}

const createLoader = (delay: any, loader: any, error?: any) => {
    return () => {
        return waitFor(delay).then(() => {
            if (loader) {
                return loader()
            }

            throw new Error(error)
        })
    }
}

const MyLoadingComponent: React.ComponentType = (props: any) => {
    return <div>MyLoadingComponent {JSON.stringify(props)}</div>
}

const MyComponent: React.ComponentType = (props: any) => {
    return <div>MyComponent {JSON.stringify(props)}</div>
}

describe('Tests for Loadable', () => {
    afterEach(async () => {
        await Loadable.preloadAll()
    })

    it('Works fine under normal conditions', async () => {
        const LoadableMyComponent = Loadable({
            loader: createLoader(400, () => MyComponent),
            loading: MyLoadingComponent,
        })

        const component1 = renderer.create(<LoadableMyComponent prop="foo" />)

        expect(component1.toJSON()).toMatchSnapshot() // initial
        await waitFor(200)
        expect(component1.toJSON()).toMatchSnapshot() // loading
        await waitFor(200)
        expect(component1.toJSON()).toMatchSnapshot() // loaded

        const component2 = renderer.create(<LoadableMyComponent prop="bar" />)

        expect(component2.toJSON()).toMatchSnapshot() // reload
    })

    it('Can use delay and timeout as expected', async () => {
        const LoadableMyComponent = Loadable({
            loader: createLoader(300, () => MyComponent),
            loading: MyLoadingComponent,
            delay: 100,
            timeout: 200,
        })

        const component1 = renderer.create(<LoadableMyComponent prop="foo" />)

        expect(component1.toJSON()).toMatchSnapshot() // initial
        await waitFor(100)
        expect(component1.toJSON()).toMatchSnapshot() // loading
        await waitFor(100)
        expect(component1.toJSON()).toMatchSnapshot() // timed out
        await waitFor(100)
        expect(component1.toJSON()).toMatchSnapshot() // loaded
    })

    it('Renders with error passed to Loading component', async () => {
        const LoadableMyComponent = Loadable({
            loader: createLoader(400, null, 'test error message'),
            loading: MyLoadingComponent,
        })

        const component = renderer.create(<LoadableMyComponent prop="baz" />)

        expect(component.toJSON()).toMatchSnapshot() // initial
        await waitFor(200)
        expect(component.toJSON()).toMatchSnapshot() // loading
        await waitFor(200)
        expect(component.toJSON()).toMatchSnapshot() // errored
    })

    it('Can manually call preload', async () => {
        const LoadableMyComponent = Loadable({
            loader: createLoader(400, () => MyComponent),
            loading: MyLoadingComponent,
        })

        // @ts-ignore
        const promise = LoadableMyComponent.preload()
        await waitFor(200)

        const component1 = renderer.create(<LoadableMyComponent prop="foo" />)

        expect(component1.toJSON()).toMatchSnapshot() // still loading...
        await promise
        expect(component1.toJSON()).toMatchSnapshot() // success

        const component2 = renderer.create(<LoadableMyComponent prop="baz" />)

        expect(component2.toJSON()).toMatchSnapshot() // success
    })

    it('Can use provided render function', async () => {
        const LoadableMyComponent = Loadable({
            loader: createLoader(400, () => ({ MyComponent })),
            loading: MyLoadingComponent,
            render(loaded, props) {
                const { MyComponent: MyComp } = loaded

                return <MyComp {...props} />
            },
        })

        const component = renderer.create(<LoadableMyComponent prop="baz" />)

        expect(component.toJSON()).toMatchSnapshot() // initial
        await waitFor(200)
        expect(component.toJSON()).toMatchSnapshot() // loading
        await waitFor(200)
        expect(component.toJSON()).toMatchSnapshot() // success
    })

    it('Works fine with Loadable.Map under normal conditions', async () => {
        const LoadableMyComponent = Loadable.Map({
            loader: {
                a: createLoader(200, () => MyComponent),
                b: createLoader(400, () => MyComponent),
            },
            loading: MyLoadingComponent,
            render(loaded, props) {
                const { a: A, b: B } = loaded

                return (
                    <div>
                        <A {...props} />
                        <B {...props} />
                    </div>
                )
            },
        })

        const component = renderer.create(<LoadableMyComponent prop="baz" />)

        expect(component.toJSON()).toMatchSnapshot() // initial
        await waitFor(200)
        expect(component.toJSON()).toMatchSnapshot() // loading
        await waitFor(200)
        expect(component.toJSON()).toMatchSnapshot() // success
    })

    it('Loadable.Map renders Loading component with error', async () => {
        const LoadableMyComponent = Loadable.Map({
            loader: {
                a: createLoader(200, () => MyComponent),
                b: createLoader(400, null, 'test map error'),
            },
            loading: MyLoadingComponent,
            render(loaded, props) {
                const { a: A, b: B } = loaded

                return (
                    <div>
                        <A {...props} />
                        <B {...props} />
                    </div>
                )
            },
        })

        const component = renderer.create(<LoadableMyComponent prop="baz" />)

        expect(component.toJSON()).toMatchSnapshot() // initial
        await waitFor(200)
        expect(component.toJSON()).toMatchSnapshot() // loading
        await waitFor(200)
        expect(component.toJSON()).toMatchSnapshot() // success
    })
})

describe('Tests for preloadReady', () => {
    beforeEach(() => {
        Reflect.defineProperty(global, '__webpack_modules__', {
            value: { '1': true, '2': true },
            enumerable: true,
            configurable: true,
        })
    })

    afterEach(() => {
        Reflect.deleteProperty(global, '__webpack_modules__')
    })

    it('Works fine if webpack prop is undefined', async () => {
        const LoadableMyComponent = Loadable({
            loader: createLoader(200, () => MyComponent),
            loading: MyLoadingComponent,
        })

        await Loadable.preloadReady()

        const component = renderer.create(<LoadableMyComponent prop="baz" />)

        expect(component.toJSON()).toMatchSnapshot()
    })

    it('Preloads component if its chunk is available', async () => {
        const LoadableMyComponent = Loadable({
            loader: createLoader(200, () => MyComponent),
            loading: MyLoadingComponent,
            webpack: () => ['1'],
        })

        await Loadable.preloadReady()

        const component = renderer.create(<LoadableMyComponent prop="baz" />)

        expect(component.toJSON()).toMatchSnapshot()
    })

    it('Preloads component if all its chunks are available', async () => {
        const LoadableMyComponent = Loadable({
            loader: createLoader(200, () => MyComponent),
            loading: MyLoadingComponent,
            webpack: () => ['1', '2'],
        })

        await Loadable.preloadReady()

        const component = renderer.create(<LoadableMyComponent prop="baz" />)

        expect(component.toJSON()).toMatchSnapshot()
    })

    it('Renders Loading component when some chunks are missing', async () => {
        const LoadableMyComponent = Loadable({
            loader: createLoader(200, () => MyComponent),
            loading: MyLoadingComponent,
            webpack: () => ['1', '42'],
        })

        await Loadable.preloadReady()

        const component = renderer.create(<LoadableMyComponent prop="baz" />)

        expect(component.toJSON()).toMatchSnapshot()
    })
})

describe('Tests for Loadable.Capture', () => {
    it('Reports modules', async () => {
        // @ts-ignore
        const __webpack_modules__ = {
            './resolved/path/to/Main.js': () => {},
        }

        const Main = () => <p>MAIN COMPONENT</p>
        const Loading = () => <p>Loading...</p>
        // const chunk = { default: Main, __esModule: true }

        const MainAsync = Loadable({
            loading: Loading,
            loader: createLoader(200, () => Main),
            modules: ['./Main.js'],
            webpack: () => ['./resolved/path/to/Main.js'],
        })

        class App extends React.Component {
            render() {
                return (
                    <div>
                        <MainAsync />
                    </div>
                )
            }
        }

        const modules: any[] = []
        const report = (m: any) => {
            modules.push(m)
        }

        await Loadable.preloadAll()

        const Comp = () => (
            <Loadable.Capture report={report}>
                <App />
            </Loadable.Capture>
        )

        const component = renderer.create(<Comp />)

        expect(component.toJSON()).toMatchSnapshot()
        expect(modules.length).toEqual(1)
        expect(modules[0]).toEqual('./Main.js')
    })
})
