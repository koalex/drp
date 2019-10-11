'use strict';

import { createStore, compose, applyMiddleware } from 'redux';
import { routerMiddleware }                      from 'connected-react-router';
import createRootReducer                         from '../reducers';
import history                                   from '../middlewares/history';
import fingerprint                               from '../middlewares/fingerprint';
import api                                       from '../middlewares/api';
import { init as themesInit }                    from '../reducers/themes';
import { init as i18nInit }                      from '../reducers/i18n';
import { init as solutionsInit }                 from '../reducers/solutions';

const defaultState = {
    i18n: i18nInit,
    themes: themesInit,
    solutions: solutionsInit
};

let DevTools;
export default function (preloadedState = defaultState) {
        const rootReducer = createRootReducer(history);
        let enhancer      = applyMiddleware(routerMiddleware(history), fingerprint, api);

        if (__DEVTOOLS__) {
            DevTools = require('../DevTools').default;
            enhancer = compose(enhancer, DevTools.instrument()); // this MW should always be connected last
        }

        const store = createStore(
            rootReducer,
            preloadedState,
            enhancer
        );

        // store.asyncReducers = {};

        if (__DEV__) {
            if (module && module.hot) {
                // Enable Webpack hot module replacement for reducers
                module.hot.accept('../reducers', () => {
                    const nextRootReducer = require('../reducers/index').default;
                    store.replaceReducer(nextRootReducer(history));
                });
            }

            window.store = store;
        }

        return store;
}
