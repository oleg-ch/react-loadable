const { JSDOM } = require('jsdom')

const addBrowserGlobals = () => {
    const dom = new JSDOM('', {
        pretendToBeVisual: true,
        url: 'http://localhost/',
    })

    global.window = dom.window
    global.document = dom.window.document
    global.navigator = dom.window.navigator
    global.history = dom.window.history
}

addBrowserGlobals()
