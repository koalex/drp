import React                            from 'react';
import { UserAgentProvider }            from '@quentin-sommer/react-useragent'
import Routes                           from './router';
import IntlProvider                     from './IntlProvider';
import ThemeProvider                    from './ThemeProvider.js'

let DevTools;
if (__DEVTOOLS__) {
    DevTools = require('./DevTools.jsx').default;
}

class App extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
                <React.Fragment>
                    {__DEVTOOLS__ ? <DevTools /> : null }
                    <UserAgentProvider ua={window.navigator.userAgent}>
                        <ThemeProvider>
                            <IntlProvider>
                                <Routes />
                            </IntlProvider>
                        </ThemeProvider>
                    </UserAgentProvider>
                </React.Fragment>
        );
    }
}

export default App;
