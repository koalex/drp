import { combineReducers } from 'redux';
import { connectRouter }   from 'connected-react-router';
import themes              from './themes';
import i18n                from './i18n';
import solutions           from './solutions';

export default function createRootReducer (history) {
	return combineReducers({
		router: connectRouter(history),
		themes,
		i18n,
		solutions
	});
}
