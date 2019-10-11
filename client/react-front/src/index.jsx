import './assets/styles/reset.css';
import './assets/styles/default.less';
import React 	   		from 'react';
import ReactDOM    		from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider}      from 'react-redux';
import App 			    from './App';
import createStore 		from './store';

let store = createStore(/*preloadedState*/);

const render = Component => {
  ReactDOM.render(
	  	<AppContainer warnings={__DEV__}>
            <Provider store={store}>
                <Component />
			</Provider>
		</AppContainer>
    ,
    document.getElementById('root')
  )
};

render(App);

if (module && module.hot) {
	module.hot.accept('./App', () => {
		let nexApp = require('./App').default;
		render(nexApp);
	});
}
